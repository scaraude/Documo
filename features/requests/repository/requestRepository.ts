import logger from '@/lib/logger';
import { type Prisma, prisma } from '@/lib/prisma';
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

    const newRequest = await prisma.documentRequest.create({
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

    const newRequest = await prisma.documentRequest.create({
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
    logger.info({ requestId: id, organizationId }, 'Deleting request for user');

    // First verify user owns the folder containing this request
    const request = await prisma.documentRequest.findUnique({
      where: { id },
      include: { folder: true },
    });

    if (!request || !request.folder || request.folder.createdByOrganizationId !== organizationId) {
      logger.warn(
        { requestId: id, organizationId },
        'User attempted to delete request they do not own',
      );
      throw new Error('Request not found or access denied');
    }

    // Perform the deletion with ownership constraint
    const result = await prisma.documentRequest.deleteMany({
      where: {
        id,
        folder: {
          createdByOrganizationId: organizationId, // Double-check ownership at DB level
        },
      },
    });

    if (result.count === 0) {
      logger.warn(
        { requestId: id, organizationId },
        'No request was deleted - ownership mismatch',
      );
      throw new Error('Request not found or access denied');
    }

    logger.info(
      { requestId: id, organizationId },
      'Request deleted successfully for user',
    );
  } catch (error) {
    logger.error(
      {
        requestId: id,
        organizationId,
        error: error instanceof Error ? error.message : error,
      },
      'Error deleting request for user',
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
      'Using deprecated deleteRequest - use deleteRequestForUser instead',
    );

    await prisma.documentRequest.delete({
      where: { id },
    });
  } catch (error) {
    logger.error(
      { requestId: id, error: error instanceof Error ? error.message : error },
      'Error deleting request from database',
    );
    throw new Error('Failed to delete request');
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
    logger.info({ requestId: id, organizationId }, 'Fetching request by ID for user');

    const request = await prisma.documentRequest.findUnique({
      where: {
        id,
        folder: {
          createdByOrganizationId: organizationId, // Only get request if user owns the folder
        },
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
      where: { id },
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
