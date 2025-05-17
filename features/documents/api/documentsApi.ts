// features/documents/api/documentsApi.ts
import * as repository from '../repository/documentsRepository';
import { AppDocument } from '@/shared/types';
import { DocumentStatus } from '@/shared/constants/documents/types';

/**
 * Get all documents
 */
export async function getDocuments(): Promise<AppDocument[]> {
    return repository.getDocuments();
}

/**
 * Upload a new document
 */
export async function uploadDocument(document: AppDocument): Promise<AppDocument> {
    return repository.uploadDocument(document);
}

/**
 * Update document status
 */
export async function updateDocumentStatus(id: string, status: DocumentStatus): Promise<AppDocument> {
    return repository.updateDocumentStatus(id, status);
}

/**
 * Delete a document
 */
export async function deleteDocument(id: string): Promise<void> {
    return repository.deleteDocument(id);
}

/**
 * Get a document by ID
 */
export async function getDocument(documentId: string): Promise<AppDocument | null> {
    return repository.getDocument(documentId);
}

/**
 * Get documents by request
 */
export async function getDocumentsByRequest(requestId: string): Promise<AppDocument[]> {
    return repository.getDocumentsByRequest(requestId);
}