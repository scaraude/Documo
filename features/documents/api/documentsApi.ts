import { Document } from '../types';
import { DocumentStatus } from '@/shared/constants/documents/types';
import * as storage from '@/features/storage/api';

const STORAGE_KEY = 'documents';

/**
 * Get all documents
 */
export async function getDocuments(): Promise<Document[]> {
    try {
        const documents = storage.getItem<Document[]>(STORAGE_KEY);
        return documents || [];
    } catch (error) {
        console.error('Error fetching documents:', error);
        throw new Error('Failed to fetch documents');
    }
}

/**
 * Upload a new document
 */
export async function uploadDocument(document: Document): Promise<Document> {
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
export async function updateDocumentStatus(id: string, status: DocumentStatus): Promise<Document> {
    try {
        const documents = await getDocuments();
        let updatedDocument: Document | undefined;

        const updatedDocuments = documents.map(doc => {
            if (doc.id === id) {
                updatedDocument = {
                    ...doc,
                    status,
                    updatedAt: new Date()
                };
                return updatedDocument;
            }
            return doc;
        });

        if (!updatedDocument) {
            throw new Error(`Document with ID ${id} not found`);
        }

        storage.setItem(STORAGE_KEY, updatedDocuments);
        return updatedDocument;
    } catch (error) {
        console.error('Error updating document status:', error);
        throw new Error('Failed to update document status');
    }
}

/**
 * Delete a document
 */
export async function deleteDocument(id: string): Promise<void> {
    try {
        const documents = await getDocuments();
        const filteredDocuments = documents.filter(doc => doc.id !== id);
        storage.setItem(STORAGE_KEY, filteredDocuments);
    } catch (error) {
        console.error('Error deleting document:', error);
        throw new Error('Failed to delete document');
    }
}

export async function getDocument(documentId: string): Promise<Document | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const documents = await getDocuments();
    return documents.find(doc => doc.id === documentId) || null;
}

export async function getDocumentsByRequest(requestId: string): Promise<Document[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const documents = await getDocuments();
    return documents.filter(doc => doc.requestId === requestId);
} 