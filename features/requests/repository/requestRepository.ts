import logger from '@/lib/logger';
import { type Prisma, prisma } from '@/lib/prisma';
import { ARCHIVED_REQUEST_DECLINE_MESSAGE } from '@/shared/constants';
import type { AppDocumentType } from '@/shared/constants';
import type {
  DocumentRequest,
  DocumentRequestWithFolder,
  DocumentRequestWithFolderAndDocuments,
} from '@/shared/types';
import { prismaDocumentToAppDocument } from '../../documents/mappers';
import type { CreateRequestParams } from '../types';

// Mapper entre le type Prisma et le type App
type PrismaDocumentRequest = Prisma.DocumentRequestGetPayload<{
  include: { requestedDocuments: true };
}>;
type PrismaDocumentRequestWithFolder = Prisma.DocumentRequestGetPayload<{
  include: { folder: true; requestedDocuments: true };
}>;
type PrismaDocumentRequestWithDocuments = Prisma.DocumentRequestGetPayload<{
  include: {
    folder: true;
    requestedDocuments: true;
    documents: { include: { type: true } };
  };
}>;

/**
 * Convertir un modèle Prisma en modèle d'application
 */
export function toAppModel(
  prismaModel: PrismaDocumentRequest,
): DocumentRequest {
  return {
    id: prismaModel.id,
    email: prismaModel.email,
    requestedDocumentIds: prismaModel.requestedDocuments.map((dt) => dt.id),
    createdAt: prismaModel.createdAt,
    expiresAt: prismaModel.expiresAt,
    updatedAt: prismaModel.updatedAt,
    acceptedAt: prismaModel.acceptedAt || undefined,
    rejectedAt: prismaModel.rejectedAt || undefined,
    completedAt: prismaModel.completedAt || undefined,
    firstDocumentUploadedAt: prismaModel.firstDocumentUploadedAt || undefined,
    folderId: prismaModel.folderId,
  };
}

/**
 * Convertir un modèle Prisma avec folder en modèle d'application
 */
function toAppModelWithFolder(
  prismaModel: PrismaDocumentRequestWithFolder,
): DocumentRequestWithFolder {
  return {
    ...toAppModel(prismaModel),
    folder: {
      id: prismaModel.folder.id,
      name: prismaModel.folder.name,
    },
  };
}

/**
 * Convertir un modèle Prisma avec folder et documents en modèle d'application
 */
function toAppModelWithFolderAndDocuments(
  prismaModel: PrismaDocumentRequestWithDocuments,
): DocumentRequestWithFolderAndDocuments {
  return {
    ...toAppModelWithFolder(prismaModel),
    documents: prismaModel.documents?.map(prismaDocumentToAppDocument) || [],
  };
}

/**
 * Get all document requests for a specific user (security-aware)
 */
export async function getRequestsForUser(
  organizationId: string,
): Promise<DocumentRequestWithFolder[]> {
  try {
    logger.info({ organizationId }, 'Fetching requests for user');

    const requests = await prisma.documentRequest.findMany({
      where: {
        folder: {
          createdByOrganizationId: organizationId, // Only get requests from user's folders
        },
        OR: [
          { declineMessage: null },
          {
            declineMessage: {
              not: ARCHIVED_REQUEST_DECLINE_MESSAGE,
            },
          },
        ],
      },
      include: {
        folder: true,
        requestedDocuments: true,
      },
    });

    logger.info(
      { organizationId, count: requests.length },
      'User requests fetched successfully',
    );
    return requests.map(toAppModelWithFolder);
  } catch (error) {
    logger.error(
      { organizationId, error: error instanceof Error ? error.message : error },
      'Error fetching requests for user',
    );
    throw new Error('Failed to fetch requests');
  }
}

/**
 * Get all document requests (⚠️ DEPRECATED: Not security-aware - use getRequestsForUser instead)
 */
export async function getRequests(): Promise<DocumentRequestWithFolder[]> {
  try {
    logger.warn(
      'Using deprecated getRequests - use getRequestsForUser instead',
    );

    const requests = await prisma.documentRequest.findMany({
      where: {
        OR: [
          { declineMessage: null },
          {
            declineMessage: {
              not: ARCHIVED_REQUEST_DECLINE_MESSAGE,
            },
          },
        ],
      },
      include: {
        folder: true,
        requestedDocuments: true,
      },
    });
    return requests.map(toAppModelWithFolder);
  } catch (error) {
    logger.error(
      { error: error instanceof Error ? error.message : error },
      'Error fetching requests from database',
    );
    throw new Error('Failed to fetch requests');
  }
}

/**
 * Create a new document request for a specific user (security-aware)
 */
export async function createRequestForUser(
  params: CreateRequestParams,
  organizationId: string,
): Promise<DocumentRequest> {
  try {
    const {
      email,
      requestedDocumentIds,
      expirationDays = 7,
      folderId,
    } = params;

    logger.info(
      {
        organizationId,
        email: email.replace(/(.{3}).*(@.*)/, '$1...$2'),
        folderId,
        requestedDocumentsCount: requestedDocumentIds.length,
      },
      'Creating request for user',
    );

    // First verify user owns the target folder
    const folder = await prisma.folder.findUnique({
      where: {
        id: folderId,
        createdByOrganizationId: organizationId,
        archivedAt: null,
      },
    });

    if (!folder) {
      logger.warn(
        { organizationId, folderId },
        'User attempted to create request for folder they do not own',
      );
      throw new Error('Folder not found or access denied');
    }

    const now = new Date();
    const expiresAt = new Date(
      now.getTime() + expirationDays * 24 * 60 * 60 * 1000,
    );

    const newRequest = await prisma.$transaction(async (tx) => {
      const createdRequest = await tx.documentRequest.create({
        data: {
          email,
          requestedDocuments: {
            connect: requestedDocumentIds.map((id) => ({ id })),
          },
          expiresAt,
          folderId,
        },
        include: {
          requestedDocuments: true,
        },
      });

      await tx.folder.update({
        where: { id: folderId },
        data: {
          lastActivityAt: now,
          completedAt: null,
        },
      });

      return createdRequest;
    });

    logger.info(
      { organizationId, requestId: newRequest.id, folderId },
      'Request created successfully for user',
    );
    return toAppModel(newRequest);
  } catch (error) {
    logger.error(
      {
        organizationId,
        folderId: params.folderId,
        error: error instanceof Error ? error.message : error,
      },
      'Error creating request for user',
    );
    throw error;
  }
}

/**
 * Create a new document request (⚠️ DEPRECATED: Not security-aware - use createRequestForUser instead)
 */
export async function createRequest(
  params: CreateRequestParams,
): Promise<DocumentRequest> {
  try {
    logger.warn(
      'Using deprecated createRequest - use createRequestForUser instead',
    );

    const {
      email,
      requestedDocumentIds,
      expirationDays = 7,
      folderId,
    } = params;
    const now = new Date();

    const expiresAt = new Date(
      now.getTime() + expirationDays * 24 * 60 * 60 * 1000,
    );

    const newRequest = await prisma.$transaction(async (tx) => {
      const createdRequest = await tx.documentRequest.create({
        data: {
          email,
          requestedDocuments: {
            connect: requestedDocumentIds.map((id) => ({ id })),
          },
          expiresAt,
          folderId,
        },
        include: {
          requestedDocuments: true,
        },
      });

      await tx.folder.update({
        where: { id: folderId },
        data: {
          lastActivityAt: now,
          completedAt: null,
        },
      });

      return createdRequest;
    });

    return toAppModel(newRequest);
  } catch (error) {
    logger.error(
      { error: error instanceof Error ? error.message : error },
      'Error creating request in database',
    );
    throw new Error('Failed to create request');
  }
}

/**
 * Delete a request for a specific user (security-aware)
 */
export async function deleteRequestForUser(
  id: string,
  organizationId: string,
): Promise<void> {
  try {
    logger.info(
      { requestId: id, organizationId },
      'Archiving request for user',
    );

    // First verify user owns the folder containing this request
    const request = await prisma.documentRequest.findUnique({
      where: { id },
      include: { folder: true },
    });

    if (
      !request ||
      !request.folder ||
      request.folder.createdByOrganizationId !== organizationId
    ) {
      logger.warn(
        { requestId: id, organizationId },
        'User attempted to delete request they do not own',
      );
      throw new Error('Request not found or access denied');
    }

    const now = new Date();

    // Perform a soft archive with ownership constraint.
    const result = await prisma.documentRequest.updateMany({
      where: {
        id,
        folder: {
          createdByOrganizationId: organizationId, // Double-check ownership at DB level
        },
        OR: [
          { declineMessage: null },
          {
            declineMessage: {
              not: ARCHIVED_REQUEST_DECLINE_MESSAGE,
            },
          },
        ],
      },
      data: {
        rejectedAt: request.rejectedAt || now,
        declineMessage: ARCHIVED_REQUEST_DECLINE_MESSAGE,
      },
    });

    if (result.count === 0) {
      logger.warn(
        { requestId: id, organizationId },
        'No request was archived - ownership mismatch',
      );
      throw new Error('Request not found or access denied');
    }

    await prisma.folder.update({
      where: { id: request.folderId },
      data: {
        lastActivityAt: now,
      },
    });

    logger.info(
      { requestId: id, organizationId },
      'Request archived successfully for user',
    );
  } catch (error) {
    logger.error(
      {
        requestId: id,
        organizationId,
        error: error instanceof Error ? error.message : error,
      },
      'Error archiving request for user',
    );
    throw error;
  }
}

/**
 * Delete a request (⚠️ DEPRECATED: Not security-aware - use deleteRequestForUser instead)
 */
export async function deleteRequest(id: string): Promise<void> {
  try {
    logger.warn(
      { requestId: id },
      'Using deprecated deleteRequest - this now archives the request',
    );

    await prisma.documentRequest.update({
      where: { id },
      data: {
        rejectedAt: new Date(),
        declineMessage: ARCHIVED_REQUEST_DECLINE_MESSAGE,
      },
    });
  } catch (error) {
    logger.error(
      { requestId: id, error: error instanceof Error ? error.message : error },
      'Error archiving request in database',
    );
    throw new Error('Failed to archive request');
  }
}

/**
 * Get a single request by ID for a specific user (security-aware)
 */
export async function getRequestByIdForUser(
  id: string,
  organizationId: string,
): Promise<DocumentRequestWithFolderAndDocuments | null> {
  try {
    logger.info(
      { requestId: id, organizationId },
      'Fetching request by ID for user',
    );

    const request = await prisma.documentRequest.findUnique({
      where: {
        id,
        folder: {
          createdByOrganizationId: organizationId, // Only get request if user owns the folder
        },
        OR: [
          { declineMessage: null },
          {
            declineMessage: {
              not: ARCHIVED_REQUEST_DECLINE_MESSAGE,
            },
          },
        ],
      },
      include: {
        folder: true,
        requestedDocuments: true,
        documents: {
          where: { deletedAt: null },
          orderBy: { uploadedAt: 'desc' },
          include: { type: true },
        },
      },
    });

    if (request) {
      logger.info(
        { requestId: id, organizationId },
        'Request fetched successfully for user',
      );
    } else {
      logger.warn(
        { requestId: id, organizationId },
        'Request not found or user not authorized',
      );
    }

    return request ? toAppModelWithFolderAndDocuments(request) : null;
  } catch (error) {
    logger.error(
      {
        requestId: id,
        organizationId,
        error: error instanceof Error ? error.message : error,
      },
      'Error fetching request for user',
    );
    throw new Error('Failed to fetch request');
  }
}

/**
 * Get a single request by ID (⚠️ DEPRECATED: Not security-aware - use getRequestByIdForUser instead)
 */
export async function getRequestById(
  id: string,
): Promise<DocumentRequestWithFolderAndDocuments | null> {
  try {
    logger.warn(
      { requestId: id },
      'Using deprecated getRequestById - use getRequestByIdForUser instead',
    );

    const request = await prisma.documentRequest.findUnique({
      where: {
        id,
        OR: [
          { declineMessage: null },
          {
            declineMessage: {
              not: ARCHIVED_REQUEST_DECLINE_MESSAGE,
            },
          },
        ],
      },
      include: {
        folder: true,
        requestedDocuments: true,
        documents: {
          where: { deletedAt: null },
          orderBy: { uploadedAt: 'desc' },
          include: { type: true },
        },
      },
    });

    return request ? toAppModelWithFolderAndDocuments(request) : null;
  } catch (error) {
    logger.error(
      { requestId: id, error: error instanceof Error ? error.message : error },
      'Error fetching request from database',
    );
    throw new Error('Failed to fetch request');
  }
}
