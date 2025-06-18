import prisma, { Prisma } from '@/lib/prisma';
import { CreateRequestParams } from '../types';
import {
  DocumentRequest,
  DocumentRequestWithFolder,
  DocumentRequestWithFolderAndDocuments,
} from '@/shared/types';
import { AppDocumentType } from '@/shared/constants';
import { prismaDocumentToAppDocument } from '../../documents/mappers';

// Mapper entre le type Prisma et le type App
type PrismaDocumentRequest = Prisma.DocumentRequestGetPayload<null>;
type PrismaDocumentRequestWithFolder = Prisma.DocumentRequestGetPayload<{
  include: { folder: true };
}>;
type PrismaDocumentRequestWithDocuments = Prisma.DocumentRequestGetPayload<{
  include: { folder: true; documents: true };
}>;

/**
 * Convertir un modèle Prisma en modèle d'application
 */
export function toAppModel(
  prismaModel: PrismaDocumentRequest
): DocumentRequest {
  return {
    id: prismaModel.id,
    email: prismaModel.email,
    requestedDocuments: prismaModel.requestedDocuments as AppDocumentType[],
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
export function toAppModelWithFolder(
  prismaModel: PrismaDocumentRequestWithFolder
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
export function toAppModelWithFolderAndDocuments(
  prismaModel: PrismaDocumentRequestWithDocuments
): DocumentRequestWithFolderAndDocuments {
  return {
    ...toAppModelWithFolder(prismaModel),
    documents: prismaModel.documents?.map(prismaDocumentToAppDocument) || [],
  };
}

/**
 * Get all document requests
 */
export async function getRequests(): Promise<DocumentRequest[]> {
  try {
    const requests = await prisma.documentRequest.findMany({
      include: {
        folder: true,
      },
    });
    return requests.map(toAppModelWithFolder);
  } catch (error) {
    console.error('Error fetching requests from database:', error);
    throw new Error('Failed to fetch requests');
  }
}

/**
 * Create a new document request
 */
export async function createRequest(
  params: CreateRequestParams
): Promise<DocumentRequest> {
  try {
    const { email, requestedDocuments, expirationDays = 7, folderId } = params;
    const now = new Date();

    const expiresAt = new Date(
      now.getTime() + expirationDays * 24 * 60 * 60 * 1000
    );

    const newRequest = await prisma.documentRequest.create({
      data: {
        email,
        requestedDocuments,
        expiresAt,
        folderId,
      },
    });

    return toAppModel(newRequest);
  } catch (error) {
    console.error('Error creating request in database:', error);
    throw new Error('Failed to create request');
  }
}

/**
 * Delete a request
 */
export async function deleteRequest(id: string): Promise<void> {
  try {
    await prisma.documentRequest.delete({
      where: { id },
    });
  } catch (error) {
    console.error('Error deleting request from database:', error);
    throw new Error('Failed to delete request');
  }
}

/**
 * Get a single request by ID
 */
export async function getRequestById(
  id: string
): Promise<DocumentRequestWithFolderAndDocuments | null> {
  try {
    const request = await prisma.documentRequest.findUnique({
      where: { id },
      include: {
        folder: true,
        documents: {
          where: { deletedAt: null },
          orderBy: { uploadedAt: 'desc' },
        },
      },
    });

    return request ? toAppModelWithFolderAndDocuments(request) : null;
  } catch (error) {
    console.error('Error fetching request from database:', error);
    throw new Error('Failed to fetch request');
  }
}
