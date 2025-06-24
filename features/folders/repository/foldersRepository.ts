// features/folders/repository/folderRepository.ts
import prisma, { Prisma } from '@/lib/prisma';
import { CreateFolderParams, Folder, FolderWithRelations } from '../types';
import { AppDocumentType } from '@/shared/constants';
import { toAppModel as resquestToAppModel } from '@/features/requests/repository/requestRepository';
import { toAppModel as folderTypeToAppModel } from '@/features/folder-types/repository/folderTypesRepository';
import { documentTypeToAppDocumentType } from '../../../shared/mapper/prismaMapper';
import logger from '@/lib/logger';

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
    requestedDocuments: prismaModel.requestedDocuments.map(
      documentTypeToAppDocumentType
    ),
    createdAt: prismaModel.createdAt,
    updatedAt: prismaModel.updatedAt,
    expiresAt: prismaModel.expiresAt || undefined,
    createdById: prismaModel.createdById || undefined,
    lastActivityAt: prismaModel.lastActivityAt || prismaModel.updatedAt,
    completedAt: prismaModel.completedAt || undefined,
  };
}

// Get folders by user ID (security-aware)
export async function getFoldersByUserId(userId: string): Promise<Folder[]> {
  try {
    logger.info({ userId }, 'Fetching folders for user');

    const folders = await prisma.folder.findMany({
      where: {
        archivedAt: null,
        createdById: userId,
      },
      include: { requestedDocuments: true },
    });

    logger.info(
      { userId, count: folders.length },
      'User folders fetched successfully'
    );
    return folders.map(toAppModel);
  } catch (error) {
    logger.error(
      { userId, error: error instanceof Error ? error.message : error },
      'Error fetching user folders from database'
    );
    throw new Error('Failed to fetch user folders');
  }
}

// Get folder by ID for specific user (security-aware)
export async function getFolderByIdForUser(
  id: string,
  userId: string
): Promise<Folder | null> {
  try {
    const folder = await prisma.folder.findUnique({
      where: {
        id,
        archivedAt: null,
        createdById: userId,
      },
      include: { requestedDocuments: true },
    });

    if (!folder) return null;

    return toAppModel(folder);
  } catch (error) {
    console.error(
      `Error fetching folder with ID ${id} for user ${userId}:`,
      error
    );
    throw new Error('Failed to fetch folder');
  }
}

// Get folder by ID with relations for specific user (security-aware)
export async function getFolderByIdWithRelationsForUser(
  id: string,
  userId: string
): Promise<FolderWithRelations | null> {
  try {
    const folder = await prisma.folder.findUnique({
      where: {
        id,
        archivedAt: null,
        createdById: userId,
      },
      include: {
        requestedDocuments: true,
        requests: {
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
      `Error fetching folder with ID ${id} for user ${userId}:`,
      error
    );
    throw new Error('Failed to fetch folder');
  }
}

// Check if user owns the folder containing a specific request (security-aware)
export async function userOwnsRequestFolder(
  requestId: string,
  userId: string
): Promise<boolean> {
  try {
    logger.info({ requestId, userId }, 'Checking folder ownership for request');

    const request = await prisma.documentRequest.findUnique({
      where: { id: requestId },
      include: {
        folder: true,
      },
    });

    if (!request || !request.folder) {
      logger.warn(
        { requestId, userId },
        'Request or folder not found during ownership check'
      );
      return false;
    }

    const isOwner = request.folder.createdById === userId;

    if (!isOwner) {
      logger.warn(
        { requestId, userId, folderId: request.folder.id },
        'User does not own folder containing request'
      );
    }

    return isOwner;
  } catch (error) {
    logger.error(
      {
        requestId,
        userId,
        error: error instanceof Error ? error.message : error,
      },
      'Error checking folder ownership for request'
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
        createdById: data.createdById,
        requestedDocumentsCount: data.requestedDocuments.length,
      },
      'Creating new folder'
    );

    const { requestedDocuments, ...folderData } = data;
    const newFolder = await prisma.folder.create({
      data: {
        ...folderData,
        createdById: folderData.createdById || '', // Ensure string is provided
        requestedDocuments: {
          connect: requestedDocuments.map(id => ({ id })),
        },
      },
      include: {
        requestedDocuments: true,
      },
    });

    logger.info(
      { folderId: newFolder.id, folderName: newFolder.name },
      'Folder created successfully'
    );
    return toAppModel(newFolder);
  } catch (error) {
    logger.error(
      {
        folderName: data.name,
        createdById: data.createdById,
        error: error instanceof Error ? error.message : error,
      },
      'Error creating folder in database'
    );
    throw new Error('Failed to create folder');
  }
}

// Update a folder for specific user (security-aware)
export async function updateFolderForUser(
  id: string,
  userId: string,
  data: Partial<{
    name: string;
    description: string;
    requestedDocuments: AppDocumentType[];
    expiresAt: Date | null;
    sharedWith: string[];
  }>
): Promise<Folder> {
  try {
    // First verify ownership
    const existingFolder = await getFolderByIdForUser(id, userId);
    if (!existingFolder) {
      throw new Error('Folder not found or access denied');
    }

    const { requestedDocuments, ...updateData } = data;
    const updatedFolder = await prisma.folder.update({
      where: {
        id,
        createdById: userId, // Double-check ownership at DB level
      },
      data: {
        ...updateData,
        ...(requestedDocuments && {
          requestedDocuments: {
            set: requestedDocuments.map(id => ({ id })),
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
        userId,
        error: error instanceof Error ? error.message : error,
      },
      'Error updating folder for user'
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
      'Error deleting folder'
    );
    throw new Error('Failed to delete folder');
  }
}

// Add a request to a folder for specific user (security-aware)
export async function addRequestToFolderForUser(
  folderId: string,
  requestId: string,
  userId: string
): Promise<void> {
  try {
    // First verify user owns the target folder
    const folder = await getFolderByIdForUser(folderId, userId);
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
    if (request.folder && request.folder.createdById !== userId) {
      throw new Error('Cannot move request from folder you do not own');
    }

    await prisma.documentRequest.update({
      where: { id: requestId },
      data: { folderId },
    });
  } catch (error) {
    console.error(
      `Error adding request ${requestId} to folder ${folderId} for user ${userId}:`,
      error
    );
    throw new Error('Failed to add request to folder');
  }
}

// Remove a request from a folder (⚠️ WARNING: Not security-aware - verify ownership before calling)
// This function only performs the removal operation, ownership must be verified beforehand
export async function removeRequestFromFolder(
  requestId: string
): Promise<void> {
  try {
    logger.info({ requestId }, 'Removing request from folder');

    await prisma.documentRequest.update({
      where: { id: requestId },
      data: { folderId: undefined },
    });

    logger.info({ requestId }, 'Request removed from folder successfully');
  } catch (error) {
    logger.error(
      {
        requestId,
        error: error instanceof Error ? error.message : error,
      },
      'Error removing request from folder'
    );
    throw new Error('Failed to remove request from folder');
  }
}

// Get user's folders with their requests count (security-aware)
export async function getFoldersWithStatsForUser(
  userId: string
): Promise<Array<Folder & { requestsCount: number }>> {
  try {
    logger.info({ userId }, 'Fetching folders with stats for user');

    const folders = await prisma.folder.findMany({
      where: {
        archivedAt: null,
        createdById: userId,
      },
      include: {
        requestedDocuments: true,
        _count: {
          select: { requests: true },
        },
      },
    });

    logger.info(
      { userId, count: folders.length },
      'User folders with stats fetched successfully'
    );

    return folders.map(folder => ({
      ...toAppModel(folder),
      requestsCount: folder._count.requests,
    }));
  } catch (error) {
    logger.error(
      {
        userId,
        error: error instanceof Error ? error.message : error,
      },
      'Error fetching folders with stats for user'
    );
    throw new Error('Failed to fetch folders with stats');
  }
}
