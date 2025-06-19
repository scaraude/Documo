// features/folders/repository/folderRepository.ts
import prisma, { Prisma } from '@/lib/prisma';
import { CreateFolderParams, Folder, FolderWithRelations } from '../types';
import { AppDocumentType } from '@/shared/constants';
import { toAppModel as resquestToAppModel } from '@/features/requests/repository/requestRepository';
import { toAppModel as folderTypeToAppModel } from '@/features/folder-types/repository/folderTypesRepository';
import { documentTypeToAppDocumentType } from '../../../shared/mapper/prismaMapper';

// Type mapper between Prisma and App
type PrismaFolder = Prisma.FolderGetPayload<{
  include: { requestedDocuments: true }
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

// Get all folders
export async function getFolders(): Promise<Folder[]> {
  try {
    const folders = await prisma.folder.findMany({
      where: { archivedAt: null },
      include: { requestedDocuments: true },
    });
    return folders.map(toAppModel);
  } catch (error) {
    console.error('Error fetching folders from database:', error);
    throw new Error('Failed to fetch folders');
  }
}

// Get folder by ID with relations
export async function getFolderById(id: string): Promise<Folder | null> {
  try {
    const folder = await prisma.folder.findUnique({
      where: { id, archivedAt: null },
      include: { requestedDocuments: true },
    });

    if (!folder) return null;

    return toAppModel(folder);
  } catch (error) {
    console.error(`Error fetching folder with ID ${id}:`, error);
    throw new Error('Failed to fetch folder');
  }
}

// Get folder by ID with relations
export async function getFolderByIdWithRelations(
  id: string
): Promise<FolderWithRelations | null> {
  try {
    const folder = await prisma.folder.findUnique({
      where: { id, archivedAt: null },
      include: {
        requestedDocuments: true,
        requests: true,
        folderType: true,
      },
    });

    if (!folder) return null;

    return {
      ...toAppModel(folder),
      requests: folder.requests.map(resquestToAppModel),
      folderType: folderTypeToAppModel(folder.folderType),
    };
  } catch (error) {
    console.error(`Error fetching folder with ID ${id}:`, error);
    throw new Error('Failed to fetch folder');
  }
}

// Create a new folder
export async function createFolder(data: CreateFolderParams): Promise<Folder> {
  try {
    const newFolder = await prisma.folder.create({
      data,
    });

    return toAppModel(newFolder);
  } catch (error) {
    console.error('Error creating folder in database:', error);
    throw new Error('Failed to create folder');
  }
}

// Update a folder
export async function updateFolder(
  id: string,
  data: Partial<{
    name: string;
    description: string;
    requestedDocuments: AppDocumentType[];
    expiresAt: Date | null;
    sharedWith: string[];
  }>
): Promise<Folder> {
  try {
    const updatedFolder = await prisma.folder.update({
      where: { id },
      data,
    });

    return toAppModel(updatedFolder);
  } catch (error) {
    console.error(`Error updating folder with ID ${id}:`, error);
    throw new Error('Failed to update folder');
  }
}

// Delete a folder
export async function deleteFolder(id: string): Promise<void> {
  try {
    await prisma.folder.update({
      where: { id },
      data: {
        archivedAt: new Date(),
      },
    });
  } catch (error) {
    console.error(`Error deleting folder with ID ${id}:`, error);
    throw new Error('Failed to delete folder');
  }
}

// Add a request to a folder
export async function addRequestToFolder(
  folderId: string,
  requestId: string
): Promise<void> {
  try {
    await prisma.documentRequest.update({
      where: { id: requestId },
      data: { folderId },
    });
  } catch (error) {
    console.error(
      `Error adding request ${requestId} to folder ${folderId}:`,
      error
    );
    throw new Error('Failed to add request to folder');
  }
}

// Remove a request from a folder
export async function removeRequestFromFolder(
  requestId: string
): Promise<void> {
  try {
    await prisma.documentRequest.update({
      where: { id: requestId },
      data: { folderId: undefined },
    });
  } catch (error) {
    console.error(`Error removing request ${requestId} from folder:`, error);
    throw new Error('Failed to remove request from folder');
  }
}

// Get all folders with their requests count
export async function getFoldersWithStats(): Promise<
  Array<Folder & { requestsCount: number }>
> {
  try {
    const folders = await prisma.folder.findMany({
      where: {
        archivedAt: null,
      },
      include: {
        requestedDocuments: true,
        _count: {
          select: { requests: true },
        },
      },
    });

    return folders.map(folder => ({
      ...toAppModel(folder),
      requestsCount: folder._count.requests,
    }));
  } catch (error) {
    console.error('Error fetching folders with stats:', error);
    throw new Error('Failed to fetch folders with stats');
  }
}
