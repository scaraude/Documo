import { prisma } from '@/lib/prisma';
import { generateSecureToken } from '@/lib/utils';
import type { AppDocument, AppDocumentToUpload } from '@/shared/types';
import {
  inputToPrismaCreateInput,
  prismaDocumentToAppDocument,
} from '../mappers';

/**
 * Upload a new document
 */
export async function uploadDocument(
  document: AppDocumentToUpload,
): Promise<AppDocument> {
  try {
    const createdDocument = await prisma.$transaction(async (tx) => {
      // Créer l'entrée en base de données
      const documentRecord = await tx.document.create({
        data: inputToPrismaCreateInput(document),
        include: { type: true },
      });

      const request = await tx.documentRequest.findUnique({
        where: { id: document.requestId },
        include: {
          requestedDocuments: { select: { id: true } },
          documents: {
            where: { deletedAt: null, invalidatedAt: null },
            select: { typeId: true },
          },
          folder: {
            select: { id: true },
          },
        },
      });

      if (request) {
        const now = new Date();
        const uploadedDocumentTypeIds = new Set(
          request.documents.map((existingDocument) => existingDocument.typeId),
        );
        const hasUploadedAllRequestedDocuments =
          request.requestedDocuments.length > 0 &&
          request.requestedDocuments.every((requestedDocument) =>
            uploadedDocumentTypeIds.has(requestedDocument.id),
          );

        await tx.documentRequest.update({
          where: { id: request.id },
          data: {
            firstDocumentUploadedAt: request.firstDocumentUploadedAt ?? now,
            completedAt: hasUploadedAllRequestedDocuments
              ? (request.completedAt ?? now)
              : null,
          },
        });

        const folderRequests = await tx.documentRequest.findMany({
          where: { folderId: request.folder.id },
          select: { completedAt: true },
        });

        const isFolderCompleted =
          folderRequests.length > 0 &&
          folderRequests.every((folderRequest) =>
            Boolean(folderRequest.completedAt),
          );

        await tx.folder.update({
          where: { id: request.folder.id },
          data: {
            lastActivityAt: now,
            completedAt: isFolderCompleted ? now : null,
          },
        });
      }

      return documentRecord;
    });

    return prismaDocumentToAppDocument(createdDocument);
  } catch (error) {
    console.error('Error uploading document to database:', error);
    throw new Error('Failed to upload document');
  }
}

/**
 * Get documents by request ID
 */
export async function getValidDocumentsByRequestId(
  requestId: string,
): Promise<AppDocument[]> {
  try {
    const documents = await prisma.document.findMany({
      where: { requestId, deletedAt: null, invalidatedAt: null },
      include: { type: true },
    });

    return documents.map(prismaDocumentToAppDocument);
  } catch (error) {
    console.error('Error fetching documents by request from database:', error);
    throw new Error('Failed to fetch documents by request');
  }
}

/**
 * Get documents by multiple request IDs
 */
export async function getValidDocumentsByRequestIds(
  requestIds: string[],
): Promise<AppDocument[]> {
  try {
    if (requestIds.length === 0) {
      return [];
    }

    const documents = await prisma.document.findMany({
      where: {
        requestId: { in: requestIds },
        deletedAt: null,
        invalidatedAt: null,
      },
      include: { type: true },
    });

    return documents.map(prismaDocumentToAppDocument);
  } catch (error) {
    console.error(
      'Error fetching documents by multiple requests from database:',
      error,
    );
    throw new Error('Failed to fetch documents by multiple requests');
  }
}

interface InvalidatedDocumentContext {
  requestId: string;
  requestEmail: string;
  folderName: string;
  organizationName: string;
  documentTypeLabel: string;
  fileName: string;
  reason: string;
  uploadToken: string;
}

export async function validateDocumentForUser(
  documentId: string,
  organizationId: string,
): Promise<AppDocument> {
  try {
    const now = new Date();

    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        deletedAt: null,
        request: {
          folder: {
            createdByOrganizationId: organizationId,
          },
        },
      },
      include: {
        type: true,
        request: {
          include: {
            folder: true,
          },
        },
      },
    });

    if (!document) {
      throw new Error('Document not found or access denied');
    }

    const validatedDocument = await prisma.$transaction(async (tx) => {
      const updated = await tx.document.update({
        where: { id: documentId },
        data: {
          validatedAt: now,
          invalidatedAt: null,
          validationErrors: [],
          errorMessage: null,
        },
        include: { type: true },
      });

      await tx.folder.update({
        where: { id: document.request.folder.id },
        data: {
          lastActivityAt: now,
        },
      });

      return updated;
    });

    return prismaDocumentToAppDocument(validatedDocument);
  } catch (error) {
    console.error('Error validating document:', error);
    throw new Error('Failed to validate document');
  }
}

export async function invalidateDocumentForUser(
  documentId: string,
  organizationId: string,
  reason: string,
): Promise<InvalidatedDocumentContext> {
  try {
    const trimmedReason = reason.trim();

    if (!trimmedReason) {
      throw new Error('Invalidation reason is required');
    }

    const now = new Date();
    const inSevenDays = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    return await prisma.$transaction(async (tx) => {
      const document = await tx.document.findFirst({
        where: {
          id: documentId,
          deletedAt: null,
          request: {
            folder: {
              createdByOrganizationId: organizationId,
            },
          },
        },
        include: {
          type: true,
          request: {
            include: {
              folder: {
                include: {
                  createdByOrganization: true,
                },
              },
            },
          },
        },
      });

      if (!document) {
        throw new Error('Document not found or access denied');
      }

      await tx.document.update({
        where: { id: documentId },
        data: {
          validatedAt: null,
          invalidatedAt: now,
          validationErrors: [trimmedReason],
        },
      });

      await tx.documentRequest.update({
        where: { id: document.request.id },
        data: {
          completedAt: null,
        },
      });

      await tx.folder.update({
        where: { id: document.request.folder.id },
        data: {
          lastActivityAt: now,
          completedAt: null,
        },
      });

      const existingShareLink = await tx.requestShareLink.findFirst({
        where: {
          requestId: document.request.id,
          expiresAt: { gt: now },
        },
        orderBy: {
          expiresAt: 'desc',
        },
      });

      const uploadToken = existingShareLink
        ? existingShareLink.token
        : (
          await tx.requestShareLink.create({
            data: {
              requestId: document.request.id,
              token: await generateSecureToken(),
              expiresAt: inSevenDays,
            },
          })
        ).token;

      return {
        requestId: document.request.id,
        requestEmail: document.request.email,
        folderName: document.request.folder.name,
        organizationName: document.request.folder.createdByOrganization.name,
        documentTypeLabel: document.type.label,
        fileName: document.fileName,
        reason: trimmedReason,
        uploadToken,
      };
    });
  } catch (error) {
    console.error('Error invalidating document:', error);
    throw new Error('Failed to invalidate document');
  }
}
