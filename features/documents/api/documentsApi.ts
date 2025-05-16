import { AppDocument } from '@/shared/types';
import { DocumentStatus } from '@/shared/constants/documents/types';
import * as storage from '@/features/storage/api';

const STORAGE_KEY = 'documents';

/**
 * Get all documents
 */
export async function getDocuments(): Promise<AppDocument[]> {
    try {
        const documents = storage.getItem<AppDocument[]>(STORAGE_KEY);
        return documents || [];
    } catch (error) {
        console.error('Error fetching documents:', error);
        throw new Error('Failed to fetch documents');
    }
}

/**
 * Upload a new document
 */
export async function uploadDocument(document: AppDocument): Promise<AppDocument> {
    try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const documents = await getDocuments();
        const updatedDocuments = [...documents, document];

        storage.setItem(STORAGE_KEY, updatedDocuments);
        return document;
    } catch (error) {
        console.error('Error uploading document:', error);
        throw new Error('Failed to upload document');
    }
}

/**
 * Update document status
 */
export async function updateDocumentStatus(id: string, status: DocumentStatus): Promise<AppDocument> {
    try {
        const documents = await getDocuments();
        const existingDocument = documents.find(doc => doc.id === id);

        if (!existingDocument) {
            throw new Error(`Document with ID ${id} not found`);
        }

        const updatedDocument = {
            ...existingDocument,
            status,
            updatedAt: new Date()
        };

        const updatedDocuments = documents.map(doc =>
            doc.id === id ? updatedDocument : doc
        );

        await storage.setItem(STORAGE_KEY, updatedDocuments);
        return updatedDocument;
    } catch (error) {
        // Don't transform known errors
        if (error instanceof Error && error.message.includes('not found')) {
            throw error;
        }
        // Re-throw storage and other errors
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Failed to update document status');
    }
}

/**
 * Delete a document
 */
export async function deleteDocument(id: string): Promise<void> {
    try {
        const documents = await getDocuments();
        const documentToDelete = documents.find(doc => doc.id === id);

        if (!documentToDelete) {
            throw new Error(`Document with ID ${id} not found`);
        }

        const filteredDocuments = documents.filter(doc => doc.id !== id);
        await storage.setItem(STORAGE_KEY, filteredDocuments);
    } catch (error) {
        // Don't transform known errors
        if (error instanceof Error && error.message.includes('not found')) {
            throw error;
        }
        // Re-throw storage and other errors
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Failed to delete document');
    }
}

export async function getDocument(documentId: string): Promise<AppDocument | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const documents = await getDocuments();
    return documents.find(doc => doc.id === documentId) || null;
}

export async function getDocumentsByRequest(requestId: string): Promise<AppDocument[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const documents = await getDocuments();
    return documents.filter(doc => doc.requestId === requestId);
}