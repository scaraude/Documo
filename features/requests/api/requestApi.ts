// features/requests/api/requestApi.ts
import { CreateRequestParams } from '../types';
import { DocumentRequest } from '@/shared/types';
import { DocumentRequestStatus } from '@/shared/constants';

/**
 * Get all document requests
 */
export async function getRequests(): Promise<DocumentRequest[]> {
    const response = await fetch('/api/requests');

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch requests');
    }

    return response.json();
}

/**
 * Create a new document request
 */
export async function createRequest(params: CreateRequestParams): Promise<DocumentRequest> {
    const response = await fetch('/api/requests', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create request');
    }

    return response.json();
}

/**
 * Update request status
 */
export async function updateRequestStatus(
    id: string,
    status: DocumentRequestStatus
): Promise<DocumentRequest> {
    const response = await fetch(`/api/requests/${id}/status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update request status');
    }

    return response.json();
}

/**
 * Delete a request
 */
export async function deleteRequest(id: string): Promise<void> {
    const response = await fetch(`/api/requests/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete request');
    }
}

/**
 * Get a single request by ID
 */
export async function getRequestById(id: string): Promise<DocumentRequest | undefined> {
    const response = await fetch(`/api/requests/${id}`);

    if (response.status === 404) {
        return undefined;
    }

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch request');
    }

    return response.json();
}