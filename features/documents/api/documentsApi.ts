// features/documents/api/documentsApi.ts
import { AppDocument } from '@/shared/types';
import { DocumentStatus } from '@/shared/constants/documents/types';
import { API_ROUTES } from '../../../shared/constants';

/**
 * Get all documents
 */
export async function getDocuments(): Promise<AppDocument[]> {
    const response = await fetch(API_ROUTES.DOCUMENTS.GET_ALL);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch documents');
    }

    return response.json();
}

/**
 * Upload a new document
 */
export async function uploadDocument(document: AppDocument): Promise<AppDocument> {
    const formData = new FormData();

    // If document has a url that's a blob, add it as file
    if (document.url) {
        const response = await fetch(document.url);
        const blob = await response.blob();
        formData.append('file', blob, 'encrypted-file');
    }

    // Add document metadata
    formData.append('document', JSON.stringify(document));

    const response = await fetch(API_ROUTES.DOCUMENTS.UPLOAD, {
        method: 'POST',
        body: formData, // FormData will set the correct Content-Type header automatically
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload document');
    }

    return response.json();
}

/**
 * Update document status
 */
export async function updateDocumentStatus(id: string, status: DocumentStatus): Promise<AppDocument> {
    const response = await fetch(API_ROUTES.DOCUMENTS.UPDATE_STATUS(id), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update document status');
    }

    return response.json();
}

/**
 * Delete a document
 */
export async function deleteDocument(id: string): Promise<void> {
    const response = await fetch(API_ROUTES.DOCUMENTS.DELETE(id), {
        method: 'DELETE',
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete document');
    }
}

/**
 * Get a document by ID
 */
export async function getDocument(documentId: string): Promise<AppDocument | null> {
    const response = await fetch(API_ROUTES.DOCUMENTS.GET_BY_ID(documentId));

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch document');
    }

    return response.json();
}

/**
 * Get documents by request
 */
export async function getDocumentsByRequest(requestId: string): Promise<AppDocument[]> {
    const response = await fetch(API_ROUTES.DOCUMENTS.GET_BY_REQUEST(requestId));

    if (!response.ok) {
        console.log('Error fetching documents by request:', response.status, response.statusText);
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch documents by request');
    }

    return response.json();
}