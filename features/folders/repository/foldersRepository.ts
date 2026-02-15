import { toAppModel as folderTypeToAppModel } from '@/features/folder-types/repository/folderTypesRepository';
import { toAppModel as resquestToAppModel } from '@/features/requests/repository/requestRepository';
import logger from '@/lib/logger';
// features/folders/repository/folderRepository.ts
import { type Prisma, prisma } from '@/lib/prisma';
import { ARCHIVED_REQUEST_DECLINE_MESSAGE } from '@/shared/constants';
import type { AppDocumentType } from '@/shared/constants';
import {
  EVENT_TYPES,
  type FolderCreatedEvent,
  createTypedEvent,
  eventBus,
} from '@/shared/lib/events';
import type { CreateFolderParams, Folder, FolderWithRelations } from '../types';

// Type mapper between Prisma and App
type PrismaFolder = Prisma.FolderGetPayload<{
  include: { requestedDocuments: true };
}>;

// Convert Prisma model to App model
function toAppModel(prismaModel: PrismaFolder): Folder {
  return {
    id: prismaModel.id,
    name: prismaModel.name,
    description: prismaModel.description || '',
    requestedDocuments: prismaModel.requestedDocuments,
    createdAt: prismaModel.createdAt,
    updatedAt: prismaModel.updatedAt,
    expiresAt: prismaModel.expiresAt || undefined,
    createdByOrganizationId: prismaModel.createdByOrganizationId || undefined,
    lastActivityAt: prismaModel.lastActivityAt || prismaModel.updatedAt,
    completedAt: prismaModel.completedAt || undefined,
  };
}

// Get folders by user ID (security-aware)
export async function getFoldersByUserId(
  organizationId: string,
): Promise<Folder[]> {
  try {
    logger.info({ organizationId }, 'Fetching folders for user');

    const folders = await prisma.folder.findMany({
      where: {
        archivedAt: null,
        createdByOrganizationId: organizationId,
      },
      include: {
        requestedDocuments: true,
        requests: {
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
          select: {
            completedAt: true,
          },
        },
      },
    });

    logger.info(
      { organizationId, count: folders.length },
      'User folders fetched successfully',
    );
    return folders.map((folder) => {
      const allRequestsCompleted =
        folder.requests.length > 0 &&
        folder.requests.every((request) => Boolean(request.completedAt));

      const latestRequestCompletionDate = folder.requests.reduce<Date | null>(
        (latestDate, request) => {
          if (!request.completedAt) return latestDate;
          if (!latestDate) return request.completedAt;
          return request.completedAt > latestDate
            ? request.completedAt
            : latestDate;
        },
        null,
      );

      const { requests: _requests, ...folderWithoutRequests } = folder;
      const folderForMapping: PrismaFolder = {
        ...folderWithoutRequests,
        completedAt: allRequestsCompleted
          ? folder.completedAt || latestRequestCompletionDate
          : null,
      };

      return toAppModel(folderForMapping);
    });
  } catch (error) {
    logger.error(
      { organizationId, error: error instanceof Error ? error.message : error },
      'Error fetching user folders from database',
    );
    throw new Error('Failed to fetch user folders');
  }
}

// Get folder by ID for specific user (security-aware)
export async function getFolderByIdForUser(
  id: string,
  organizationId: string,
): Promise<Folder | null> {
  try {
    const folder = await prisma.folder.findUnique({
      where: {
        id,
        archivedAt: null,
        createdByOrganizationId: organizationId,
      },
      include: { requestedDocuments: true },
    });

    if (!folder) return null;

    return toAppModel(folder);
  } catch (error) {
    console.error(
      `Error fetching folder with ID ${id} for user ${organizationId}:`,
      error,
    );
    throw new Error('Failed to fetch folder');
  }
}

// Get folder by ID with relations for specific user (security-aware)
export async function getFolderByIdWithRelationsForUser(
  id: string,
  organizationId: string,
): Promise<FolderWithRelations | null> {
  try {
    const folder = await prisma.folder.findUnique({
      where: {
        id,
        archivedAt: null,
        createdByOrganizationId: organizationId,
      },
      include: {
        requestedDocuments: true,
        requests: {
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
            requestedDocuments: true,
          },
        },
        folderType: {
          include: {
            requiredDocuments: true,
          },
        },
      },
    });

    if (!folder) return null;

    return {
      ...toAppModel(folder),
      requests: folder.requests.map(resquestToAppModel),
      folderType: folderTypeToAppModel(folder.folderType),
    };
  } catch (error) {
    console.error(
      `Error fetching folder with ID ${id} for user ${organizationId}:`,
      error,
    );
    throw new Error('Failed to fetch folder');
  }
}

// Check if user owns the folder containing a specific request (security-aware)
export async function userOwnsRequestFolder(
  requestId: string,
  organizationId: string,
): Promise<boolean> {
  try {
    logger.info(
      { requestId, organizationId },
      'Checking folder ownership for request',
    );

    const request = await prisma.documentRequest.findUnique({
      where: {
        id: requestId,
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
      },
    });

    if (!request || !request.folder) {
      logger.warn(
        { requestId, organizationId },
        'Request or folder not found during ownership check',
      );
      return false;
    }

    const isOwner = request.folder.createdByOrganizationId === organizationId;

    if (!isOwner) {
      logger.warn(
        { requestId, organizationId, folderId: request.folder.id },
        'User does not own folder containing request',
      );
    }

    return isOwner;
  } catch (error) {
    logger.error(
      {
        requestId,
        organizationId,
        error: error instanceof Error ? error.message : error,
      },
      'Error checking folder ownership for request',
    );
    return false; // Fail secure
  }
}

// Create a new folder
export async function createFolder(data: CreateFolderParams): Promise<Folder> {
  try {
    logger.info(
      {
        folderName: data.name,
        folderTypeId: data.folderTypeId,
        createdByOrganizationId: data.createdByOrganizationId,
        requestedDocumentsCount: data.requestedDocumentIds.length,
      },
      'Creating new folder',
    );

    const { requestedDocumentIds, ...folderData } = data;
    const newFolder = await prisma.folder.create({
      data: {
        ...folderData,
        createdByOrganizationId: folderData.createdByOrganizationId || '', // Ensure string is provided
        requestedDocuments: {
          connect: requestedDocumentIds.map((id) => ({ id })),
        },
      },
      include: {
        requestedDocuments: true,
      },
    });

    logger.info(
      { folderId: newFolder.id, folderName: newFolder.name },
      'Folder created successfully',
    );

    // Publish domain event after successful creation
    await eventBus.publish(
      createTypedEvent<FolderCreatedEvent>(
        EVENT_TYPES.FOLDER.CREATED,
        newFolder.id,
        {
          folderId: newFolder.id,
          name: newFolder.name,
          createdByOrganizationId: newFolder.createdByOrganizationId || '',
          folderTypeId: newFolder.folderTypeId,
        },
        newFolder.createdByOrganizationId || undefined,
      ),
    );

    return toAppModel(newFolder);
  } catch (error) {
    logger.error(
      {
        folderName: data.name,
        createdByOrganizationId: data.createdByOrganizationId,
        error: error instanceof Error ? error.message : error,
      },
      'Error creating folder in database',
    );
    throw new Error('Failed to create folder');
  }
}

// Update a folder for specific user (security-aware)
export async function updateFolderForUser(
  id: string,
  organizationId: string,
  data: Partial<{
    name: string;
    description: string;
    requestedDocuments: AppDocumentType[];
    expiresAt: Date | null;
    sharedWith: string[];
  }>,
): Promise<Folder> {
  try {
    // First verify ownership
    const existingFolder = await getFolderByIdForUser(id, organizationId);
    if (!existingFolder) {
      throw new Error('Folder not found or access denied');
    }

    const { requestedDocuments, ...updateData } = data;
    const updatedFolder = await prisma.folder.update({
      where: {
        id,
        createdByOrganizationId: organizationId, // Double-check ownership at DB level
      },
      data: {
        ...updateData,
        ...(requestedDocuments && {
          requestedDocuments: {
            set: requestedDocuments.map((id) => ({ id })),
          },
        }),
      },
      include: {
        requestedDocuments: true,
      },
    });

    return toAppModel(updatedFolder);
  } catch (error) {
    logger.error(
      {
        folderId: id,
        organizationId,
        error: error instanceof Error ? error.message : error,
      },
      'Error updating folder for user',
    );
    throw new Error('Failed to update folder');
  }
}

// Delete a folder (⚠️ WARNING: Not security-aware - verify ownership before calling)
// This function only performs the delete operation, ownership must be verified beforehand
export async function deleteFolder(id: string): Promise<void> {
  try {
    logger.info({ folderId: id }, 'Archiving folder');

    await prisma.folder.update({
      where: { id },
      data: {
        archivedAt: new Date(),
      },
    });

    logger.info({ folderId: id }, 'Folder archived successfully');
  } catch (error) {
    logger.error(
      { folderId: id, error: error instanceof Error ? error.message : error },
      'Error deleting folder',
    );
    throw new Error('Failed to delete folder');
  }
}

// Add a request to a folder for specific user (security-aware)
export async function addRequestToFolderForUser(
  folderId: string,
  requestId: string,
  organizationId: string,
): Promise<void> {
  try {
    // First verify user owns the target folder
    const folder = await getFolderByIdForUser(folderId, organizationId);
    if (!folder) {
      throw new Error('Folder not found or access denied');
    }

    // Check if user owns the request or if request exists
    const request = await prisma.documentRequest.findUnique({
      where: { id: requestId },
      include: { folder: true },
    });

    if (!request) {
      throw new Error('Request not found');
    }

    // If request is already in a folder, verify user owns that folder too
    if (
      request.folder &&
      request.folder.createdByOrganizationId !== organizationId
    ) {
      throw new Error('Cannot move request from folder you do not own');
    }

    await prisma.documentRequest.update({
      where: { id: requestId },
      data: { folderId },
    });
  } catch (error) {
    console.error(
      `Error adding request ${requestId} to folder ${folderId} for user ${organizationId}:`,
      error,
    );
    throw new Error('Failed to add request to folder');
  }
}

// Archive a request from a folder (append-only behavior).
// This function only performs the archive operation, ownership must be verified beforehand.
export async function removeRequestFromFolder(
  requestId: string,
): Promise<void> {
  try {
    logger.info({ requestId }, 'Archiving request from folder');

    const now = new Date();

    await prisma.$transaction(async (tx) => {
      const request = await tx.documentRequest.findUnique({
        where: {
          id: requestId,
          OR: [
            { declineMessage: null },
            {
              declineMessage: {
                not: ARCHIVED_REQUEST_DECLINE_MESSAGE,
              },
            },
          ],
        },
      });

      if (!request) {
        throw new Error('Request not found');
      }

      await tx.documentRequest.update({
        where: { id: requestId },
        data: {
          rejectedAt: request.rejectedAt || now,
          declineMessage: ARCHIVED_REQUEST_DECLINE_MESSAGE,
        },
      });

      await tx.folder.update({
        where: { id: request.folderId },
        data: { lastActivityAt: now },
      });
    });

    logger.info({ requestId }, 'Request archived successfully from folder');
  } catch (error) {
    logger.error(
      {
        requestId,
        error: error instanceof Error ? error.message : error,
      },
      'Error archiving request from folder',
    );
    throw new Error('Failed to archive request');
  }
}

// Get user's folders with their requests count (security-aware)
export async function getFoldersWithStatsForUser(
  organizationId: string,
): Promise<Array<Folder & { requestsCount: number }>> {
  try {
    logger.info({ organizationId }, 'Fetching folders with stats for user');

    const folders = await prisma.folder.findMany({
      where: {
        archivedAt: null,
        createdByOrganizationId: organizationId,
      },
      include: {
        requestedDocuments: true,
        _count: {
          select: { requests: true },
        },
      },
    });

    logger.info(
      { organizationId, count: folders.length },
      'User folders with stats fetched successfully',
    );

    return folders.map((folder): Folder & { requestsCount: number } => ({
      ...toAppModel(folder),
      requestsCount: folder._count.requests,
    }));
  } catch (error) {
    logger.error(
      {
        organizationId,
        error: error instanceof Error ? error.message : error,
      },
      'Error fetching folders with stats for user',
    );
    throw new Error('Failed to fetch folders with stats');
  }
}
