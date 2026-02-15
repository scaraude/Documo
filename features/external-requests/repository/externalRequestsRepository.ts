// features/external-requests/repository/externalRequestsRepository.ts
import { prisma } from '@/lib/prisma';
import { generateSecureToken } from '../../../lib/utils';
import type { CreateShareLinkParams } from '../types/api';

/**
 * Create a new share link for a request
 */
export async function createShareLink(params: CreateShareLinkParams) {
  const token = await generateSecureToken();

  return await prisma.requestShareLink.create({
    data: {
      requestId: params.requestId,
      token,
      expiresAt: params.expiresAt,
    },
  });
}

/**
 * Get a share link by token
 */
export async function getShareLinkByToken(token: string) {
  return await prisma.requestShareLink.findFirst({
    where: {
      token,
      expiresAt: {
        gt: new Date(), // Only return non-expired tokens
      },
    },
    include: {
      request: {
        include: {
          requestedDocuments: true,
          folder: {
            include: {
              createdByOrganization: true,
            },
          },
        },
      },
    },
  });
}

/**
 * Delete expired share links
 */
export async function deleteExpiredShareLinks() {
  return await prisma.requestShareLink.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
}

/**
 * Accept a document request
 */
export async function acceptRequest(requestId: string) {
  return await prisma.$transaction(async (tx) => {
    const request = await tx.documentRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new Error('Request not found');
    }

    if (request.rejectedAt) {
      throw new Error('Cannot accept a rejected request');
    }

    if (request.completedAt) {
      throw new Error('Cannot accept a completed request');
    }

    if (request.acceptedAt) {
      return request;
    }

    const now = new Date();
    const updatedRequest = await tx.documentRequest.update({
      where: { id: requestId },
      data: {
        acceptedAt: now,
      },
    });

    await tx.folder.update({
      where: { id: request.folderId },
      data: {
        lastActivityAt: now,
        completedAt: null,
      },
    });

    return updatedRequest;
  });
}

/**
 * Decline a document request
 */
export async function declineRequest(requestId: string, message?: string) {
  return await prisma.$transaction(async (tx) => {
    const request = await tx.documentRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new Error('Request not found');
    }

    if (request.acceptedAt) {
      throw new Error('Cannot decline an accepted request');
    }

    if (request.completedAt) {
      throw new Error('Cannot decline a completed request');
    }

    if (request.rejectedAt) {
      return request;
    }

    const now = new Date();
    const updatedRequest = await tx.documentRequest.update({
      where: { id: requestId },
      data: {
        rejectedAt: now,
        declineMessage: message,
      },
    });

    await tx.folder.update({
      where: { id: request.folderId },
      data: {
        lastActivityAt: now,
        completedAt: null,
      },
    });

    return updatedRequest;
  });
}
