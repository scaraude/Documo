import logger from '@/lib/logger';
import { type Prisma, prisma } from '@/lib/prisma';
import type {
  CreateFolderTypeParams,
  FolderType,
  UpdateFolderTypeParams,
} from '../types';

// Type mapper entre Prisma et App
type PrismaFolderType = Prisma.FolderTypeGetPayload<{
  include: { requiredDocuments: true };
}>;

/**
 * Convertir un modèle Prisma en modèle d'application
 */
export function toAppModel(prismaModel: PrismaFolderType): FolderType {
  return {
    id: prismaModel.id,
    name: prismaModel.name,
    description: prismaModel.description || '',
    requiredDocuments: prismaModel.requiredDocuments,
    createdAt: prismaModel.createdAt,
    updatedAt: prismaModel.updatedAt,
    deletedAt: prismaModel.deletedAt || undefined,
    createdById: prismaModel.createdById || undefined,
  };
}

/**
 * Get folder types by user ID (user-scoped) - SECURE
 */
export async function getFolderTypesByUserId(
  userId: string,
): Promise<FolderType[]> {
  try {
    logger.info(
      { userId, operation: 'getFolderTypesByUserId' },
      'Fetching folder types for user',
    );
    const folderTypes = await prisma.folderType.findMany({
      where: {
        deletedAt: null,
        createdById: userId, // Filter by owner
      },
      include: {
        requiredDocuments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    logger.info(
      { userId, count: folderTypes.length },
      'Folder types fetched successfully',
    );
    return folderTypes.map(toAppModel);
  } catch (error) {
    logger.error(
      {
        userId,
        operation: 'getFolderTypesByUserId',
        error: error instanceof Error ? error.message : error,
      },
      'Error fetching folder types for user',
    );
    throw new Error('Failed to fetch folder types');
  }
}

/**
 * Get folder type by ID for specific user (ownership check) - SECURE
 */
export async function getFolderTypeByIdForUser(
  id: string,
  userId: string,
): Promise<FolderType | null> {
  try {
    logger.info(
      { folderTypeId: id, userId, operation: 'getFolderTypeByIdForUser' },
      'Fetching folder type with ownership check',
    );
    const folderType = await prisma.folderType.findFirst({
      where: {
        id,
        deletedAt: null,
        createdById: userId, // Ownership check
      },
      include: {
        requiredDocuments: true,
      },
    });

    const result = folderType ? toAppModel(folderType) : null;
    logger.info(
      { folderTypeId: id, userId, found: !!result },
      'Folder type fetch completed',
    );
    return result;
  } catch (error) {
    logger.error(
      {
        folderTypeId: id,
        userId,
        operation: 'getFolderTypeByIdForUser',
        error: error instanceof Error ? error.message : error,
      },
      'Error fetching folder type with ownership check',
    );
    throw new Error('Failed to fetch folder type');
  }
}

/**
 * Create a new folder type - SECURE (requires user ID)
 */
export async function createFolderType(
  params: CreateFolderTypeParams,
): Promise<FolderType> {
  try {
    const { name, description, requiredDocuments, createdById } = params;

    if (!createdById) {
      throw new Error('User ID is required to create folder type');
    }

    logger.info(
      { name, userId: createdById, operation: 'createFolderType' },
      'Creating folder type',
    );

    const newFolderType = await prisma.folderType.create({
      data: {
        name,
        description: description || null,
        requiredDocuments: {
          connect: requiredDocuments.map((id) => ({ id })),
        },
        createdById,
      },
      include: {
        requiredDocuments: true,
      },
    });

    const result = toAppModel(newFolderType);
    logger.info(
      { folderTypeId: result.id, name: result.name, userId: createdById },
      'Folder type created successfully',
    );
    return result;
  } catch (error) {
    logger.error(
      {
        name: params.name,
        userId: params.createdById,
        operation: 'createFolderType',
        error: error instanceof Error ? error.message : error,
      },
      'Error creating folder type',
    );
    throw new Error('Failed to create folder type');
  }
}

/**
 * Update a folder type - SECURE (ownership should be verified by caller)
 */
export async function updateFolderType(
  id: string,
  params: UpdateFolderTypeParams,
): Promise<FolderType> {
  try {
    const { name, description, requiredDocuments } = params;

    logger.info(
      { folderTypeId: id, updateParams: params, operation: 'updateFolderType' },
      'Updating folder type',
    );

    const updatedFolderType = await prisma.folderType.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(requiredDocuments !== undefined && {
          requiredDocuments: {
            set: requiredDocuments.map((id) => ({ id })),
          },
        }),
      },
      include: {
        requiredDocuments: true,
      },
    });

    const result = toAppModel(updatedFolderType);
    logger.info(
      { folderTypeId: id, name: result.name },
      'Folder type updated successfully',
    );
    return result;
  } catch (error) {
    logger.error(
      {
        folderTypeId: id,
        operation: 'updateFolderType',
        error: error instanceof Error ? error.message : error,
      },
      'Error updating folder type',
    );
    throw new Error('Failed to update folder type');
  }
}

/**
 * Soft delete a folder type - SECURE (ownership should be verified by caller)
 */
export async function deleteFolderType(id: string): Promise<void> {
  try {
    logger.info(
      { folderTypeId: id, operation: 'deleteFolderType' },
      'Deleting folder type',
    );

    await prisma.folderType.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    logger.info({ folderTypeId: id }, 'Folder type deleted successfully');
  } catch (error) {
    logger.error(
      {
        folderTypeId: id,
        operation: 'deleteFolderType',
        error: error instanceof Error ? error.message : error,
      },
      'Error deleting folder type',
    );
    throw new Error('Failed to delete folder type');
  }
}

/**
 * Check if folder type is used - SECURE (ownership should be verified by caller)
 */
export async function isFolderTypeInUse(id: string): Promise<boolean> {
  try {
    logger.info(
      { folderTypeId: id, operation: 'isFolderTypeInUse' },
      'Checking folder type usage',
    );

    const count = await prisma.folder.count({
      where: {
        folderTypeId: id,
        archivedAt: null,
      },
    });

    const inUse = count > 0;
    logger.info(
      { folderTypeId: id, inUse, folderCount: count },
      'Folder type usage check completed',
    );
    return inUse;
  } catch (error) {
    logger.error(
      {
        folderTypeId: id,
        operation: 'isFolderTypeInUse',
        error: error instanceof Error ? error.message : error,
      },
      'Error checking folder type usage',
    );
    throw new Error('Failed to check folder type usage');
  }
}
