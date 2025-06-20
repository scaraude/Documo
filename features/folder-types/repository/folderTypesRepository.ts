import prisma, { Prisma } from '@/lib/prisma';
import {
  FolderType,
  CreateFolderTypeParams,
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
 * Get all active folder types
 */
export async function getFolderTypes(): Promise<FolderType[]> {
  try {
    const folderTypes = await prisma.folderType.findMany({
      where: {
        deletedAt: null, // Soft delete
      },
      include: {
        requiredDocuments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return folderTypes.map(toAppModel);
  } catch (error) {
    console.error('Error fetching folder types from database:', error);
    throw new Error('Failed to fetch folder types');
  }
}

/**
 * Get folder type by ID
 */
export async function getFolderTypeById(
  id: string
): Promise<FolderType | null> {
  try {
    const folderType = await prisma.folderType.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        requiredDocuments: true,
      },
    });

    return folderType ? toAppModel(folderType) : null;
  } catch (error) {
    console.error(`Error fetching folder type with ID ${id}:`, error);
    throw new Error('Failed to fetch folder type');
  }
}

/**
 * Create a new folder type
 */
export async function createFolderType(
  params: CreateFolderTypeParams
): Promise<FolderType> {
  try {
    const { name, description, requiredDocuments, createdById } = params;

    const newFolderType = await prisma.folderType.create({
      data: {
        name,
        description: description || null,
        requiredDocuments: {
          connect: requiredDocuments.map(id => ({ id })),
        },
        createdById: createdById || '',
      },
      include: {
        requiredDocuments: true,
      },
    });

    return toAppModel(newFolderType);
  } catch (error) {
    console.error('Error creating folder type in database:', error);
    throw new Error('Failed to create folder type');
  }
}

/**
 * Update a folder type
 */
export async function updateFolderType(
  id: string,
  params: UpdateFolderTypeParams
): Promise<FolderType> {
  try {
    const { name, description, requiredDocuments } = params;

    const updatedFolderType = await prisma.folderType.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(requiredDocuments !== undefined && {
          requiredDocuments: {
            set: requiredDocuments.map(id => ({ id })),
          },
        }),
      },
      include: {
        requiredDocuments: true,
      },
    });

    return toAppModel(updatedFolderType);
  } catch (error) {
    console.error(`Error updating folder type with ID ${id}:`, error);
    throw new Error('Failed to update folder type');
  }
}

/**
 * Soft delete a folder type
 */
export async function deleteFolderType(id: string): Promise<void> {
  try {
    await prisma.folderType.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  } catch (error) {
    console.error(`Error deleting folder type with ID ${id}:`, error);
    throw new Error('Failed to delete folder type');
  }
}

/**
 * Get folder types with usage statistics
 */
export async function getFolderTypesWithStats(): Promise<
  Array<
    FolderType & {
      foldersCount: number;
      activeFoldersCount: number;
    }
  >
> {
  try {
    const folderTypes = await prisma.folderType.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        requiredDocuments: true,
        _count: {
          select: { folders: true },
        },
        folders: {
          select: {
            archivedAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return folderTypes.map(ft => ({
      ...toAppModel(ft),
      foldersCount: ft._count.folders,
      activeFoldersCount: ft.folders.filter(f => !f.archivedAt).length,
    }));
  } catch (error) {
    console.error('Error fetching folder types with stats:', error);
    throw new Error('Failed to fetch folder types with stats');
  }
}

/**
 * Check if folder type is used
 */
export async function isFolderTypeInUse(id: string): Promise<boolean> {
  try {
    const count = await prisma.folder.count({
      where: {
        folderTypeId: id,
        archivedAt: null,
      },
    });

    return count > 0;
  } catch (error) {
    console.error(`Error checking if folder type ${id} is in use:`, error);
    throw new Error('Failed to check folder type usage');
  }
}
