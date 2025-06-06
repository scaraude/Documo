import prisma from '@/lib/prisma';
import { AppDocument } from '@/shared/types';
import { inputToPrismaCreateInput, prismaDocumentToAppDocument } from '../mappers';

/**
 * Get all documents
 */
export async function getDocuments(): Promise<AppDocument[]> {
    try {
        const documents = await prisma.document.findMany();
        return documents.map(prismaDocumentToAppDocument);
    } catch (error) {
        console.error('Error fetching documents from database:', error);
        throw new Error('Failed to fetch documents');
    }
}

/**
 * Upload a new document
 */
export async function uploadDocument(document: AppDocument): Promise<AppDocument> {
    try {
        // Créer l'entrée en base de données
        const createdDocument = await prisma.document.create({
            data: inputToPrismaCreateInput(document)
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
export async function deleteDocument(id: string): Promise<void> {
    try {
        await prisma.document.delete({
            where: { id }
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
export async function getDocument(documentId: string): Promise<AppDocument | null> {
    try {
        const document = await prisma.document.findUnique({
            where: { id: documentId }
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
export async function getDocumentsByRequest(requestId: string): Promise<AppDocument[]> {
    try {
        const documents = await prisma.document.findMany({
            where: { requestId }
        });

        return documents.map(prismaDocumentToAppDocument);
    } catch (error) {
        console.error('Error fetching documents by request from database:', error);
        throw new Error('Failed to fetch documents by request');
    }
}