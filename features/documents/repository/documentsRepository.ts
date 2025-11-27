import { prisma } from '@/lib/prisma';
import type { AppDocument, AppDocumentToUpload } from '@/shared/types';
import {
  inputToPrismaCreateInput,
  prismaDocumentToAppDocument,
} from '../mappers';

/**
 * Get all documents
 */
async function getDocuments(): Promise<AppDocument[]> {
  try {
    const documents = await prisma.document.findMany({
      include: { type: true },
    });
    return documents.map(prismaDocumentToAppDocument);
  } catch (error) {
    console.error('Error fetching documents from database:', error);
    throw new Error('Failed to fetch documents');
  }
}

/**
 * Upload a new document
 */
export async function uploadDocument(
  document: AppDocumentToUpload,
): Promise<AppDocument> {
  try {
    // Créer l'entrée en base de données
    const createdDocument = await prisma.document.create({
      data: inputToPrismaCreateInput(document),
      include: { type: true },
    });

    return prismaDocumentToAppDocument(createdDocument);
  } catch (error) {
    console.error('Error uploading document to database:', error);
    throw new Error('Failed to upload document');
  }
}

/**
 * Delete a document
 */
async function deleteDocument(id: string): Promise<void> {
  try {
    await prisma.document.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    // biome-ignore lint/suspicious/noExplicitAny: any needed for error handling
  } catch (error: any) {
    // Gérer les erreurs spécifiques
    if (error?.code === 'P2025') {
      throw new Error(`Document with ID ${id} not found`);
    }

    console.error('Error deleting document from database:', error);
    throw new Error('Failed to delete document');
  }
}

/**
 * Get a document by ID
 */
async function getDocument(documentId: string): Promise<AppDocument | null> {
  try {
    const document = await prisma.document.findUnique({
      where: { id: documentId, deletedAt: null },
      include: { type: true },
    });

    return document ? prismaDocumentToAppDocument(document) : null;
  } catch (error) {
    console.error('Error fetching document from database:', error);
    throw new Error('Failed to fetch document');
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
