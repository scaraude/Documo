import { randomUUID } from 'crypto';
import { appRouter } from '@/lib/trpc/root';
import { prisma } from '@/lib/prisma';
import { APP_DOCUMENT_TYPES } from '@/shared/constants';
import { type NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { sendDocumentInvalidatedEmail } from '@/lib/email';

vi.mock('@/lib/email', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/email')>();
  return {
    ...actual,
    sendDocumentInvalidatedEmail: vi.fn().mockResolvedValue({ success: true }),
  };
});

type Scenario = {
  organizationId: string;
  folderTypeId: string;
  folderId: string;
  requestId: string;
  documentId: string;
  sessionId: string;
  sessionToken: string;
  requestEmail: string;
  existingToken?: string;
};

const createdScenarios: Scenario[] = [];

function createCaller(sessionToken: string) {
  const req = {
    cookies: {
      get: (name: string) =>
        name === 'session' ? { value: sessionToken } : undefined,
    },
  } as unknown as NextRequest;

  return appRouter.createCaller({
    req,
    resHeaders: new Headers(),
  });
}

async function createScenario(withExistingShareLink: boolean): Promise<Scenario> {
  const now = new Date();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const suffix = randomUUID();

  const organization = await prisma.organization.create({
    data: {
      email: `doc-validation-org-${suffix}@example.com`,
      name: `Doc Validation Org ${suffix}`,
    },
  });

  const folderType = await prisma.folderType.create({
    data: {
      name: `Validation Folder Type ${suffix}`,
      createdByOrganizationId: organization.id,
      requiredDocuments: {
        connect: [{ id: APP_DOCUMENT_TYPES.IDENTITY_PROOF }],
      },
    },
  });

  const folder = await prisma.folder.create({
    data: {
      name: `Validation Folder ${suffix}`,
      folderTypeId: folderType.id,
      createdByOrganizationId: organization.id,
      completedAt: now,
      lastActivityAt: now,
      requestedDocuments: {
        connect: [{ id: APP_DOCUMENT_TYPES.IDENTITY_PROOF }],
      },
    },
  });

  const requestEmail = `requester-${suffix}@example.com`;
  const request = await prisma.documentRequest.create({
    data: {
      email: requestEmail,
      expiresAt,
      acceptedAt: now,
      completedAt: now,
      folderId: folder.id,
      requestedDocuments: {
        connect: [{ id: APP_DOCUMENT_TYPES.IDENTITY_PROOF }],
      },
    },
  });

  const document = await prisma.document.create({
    data: {
      requestId: request.id,
      typeId: APP_DOCUMENT_TYPES.IDENTITY_PROOF,
      fileName: 'identity-proof.pdf',
      mimeType: 'application/pdf',
      originalSize: 1024,
      url: `https://example.com/encrypted/${suffix}.bin`,
      hash: `hash-${suffix}`,
      uploadedAt: now,
      validatedAt: now,
      validationErrors: [],
      DEK: 'ZGVrLXRlc3QtdmFsdWU=',
    },
  });

  let existingToken: string | undefined;
  if (withExistingShareLink) {
    existingToken = `existing-token-${suffix}`;
    await prisma.requestShareLink.create({
      data: {
        requestId: request.id,
        token: existingToken,
        expiresAt,
      },
    });
  }

  const sessionToken = `session-${suffix}`;
  const session = await prisma.organizationSession.create({
    data: {
      organizationId: organization.id,
      token: sessionToken,
      expiresAt,
    },
  });

  const scenario = {
    organizationId: organization.id,
    folderTypeId: folderType.id,
    folderId: folder.id,
    requestId: request.id,
    documentId: document.id,
    sessionId: session.id,
    sessionToken,
    requestEmail,
    existingToken,
  };

  createdScenarios.push(scenario);
  return scenario;
}

async function cleanupScenario(scenario: Scenario) {
  await prisma.document.deleteMany({
    where: { requestId: scenario.requestId },
  });
  await prisma.requestShareLink.deleteMany({
    where: { requestId: scenario.requestId },
  });
  await prisma.documentRequest.deleteMany({
    where: { id: scenario.requestId },
  });
  await prisma.folder.deleteMany({
    where: { id: scenario.folderId },
  });
  await prisma.folderType.deleteMany({
    where: { id: scenario.folderTypeId },
  });
  await prisma.organizationSession.deleteMany({
    where: { id: scenario.sessionId },
  });
  await prisma.organization.deleteMany({
    where: { id: scenario.organizationId },
  });
}

describe('Document invalidation mutation integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(async () => {
    while (createdScenarios.length > 0) {
      const scenario = createdScenarios.pop();
      if (scenario) {
        await cleanupScenario(scenario);
      }
    }
  });

  it('reopens request/folder, creates upload token, and sends invalidation email', async () => {
    const reason = 'Document unreadable: please upload a clearer file.';
    const scenario = await createScenario(false);
    const caller = createCaller(scenario.sessionToken);

    const result = await caller.documents.invalidate({
      documentId: scenario.documentId,
      reason,
    });

    expect(result).toEqual({ success: true });

    const document = await prisma.document.findUnique({
      where: { id: scenario.documentId },
    });
    const request = await prisma.documentRequest.findUnique({
      where: { id: scenario.requestId },
    });
    const folder = await prisma.folder.findUnique({
      where: { id: scenario.folderId },
    });
    const shareLinks = await prisma.requestShareLink.findMany({
      where: { requestId: scenario.requestId },
    });

    expect(document?.validatedAt).toBeNull();
    expect(document?.invalidatedAt).toBeInstanceOf(Date);
    expect(document?.validationErrors).toEqual([reason]);
    expect(request?.completedAt).toBeNull();
    expect(folder?.completedAt).toBeNull();
    expect(shareLinks).toHaveLength(1);

    const emailMock = vi.mocked(sendDocumentInvalidatedEmail);
    expect(emailMock).toHaveBeenCalledTimes(1);
    expect(emailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: scenario.requestEmail,
        reason,
        uploadUrl: expect.stringContaining('/external/upload/'),
      }),
    );

    const calledUploadUrl = emailMock.mock.calls[0]?.[0].uploadUrl ?? '';
    const tokenFromEmail = calledUploadUrl.split('/').pop();
    expect(tokenFromEmail).toBeDefined();
    expect(shareLinks[0]?.token).toBe(tokenFromEmail);
  });

  it('reuses existing non-expired share link token when invalidating', async () => {
    const reason = 'Document expired: please upload a valid one.';
    const scenario = await createScenario(true);
    const caller = createCaller(scenario.sessionToken);

    await caller.documents.invalidate({
      documentId: scenario.documentId,
      reason,
    });

    const shareLinks = await prisma.requestShareLink.findMany({
      where: { requestId: scenario.requestId },
    });
    expect(shareLinks).toHaveLength(1);
    expect(shareLinks[0]?.token).toBe(scenario.existingToken);

    const emailMock = vi.mocked(sendDocumentInvalidatedEmail);
    const calledUploadUrl = emailMock.mock.calls[0]?.[0].uploadUrl ?? '';
    expect(calledUploadUrl.endsWith(`/${scenario.existingToken}`)).toBe(true);
  });
});
