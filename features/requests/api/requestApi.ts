// features/requests/api/requestApi.ts
import { CreateRequestParams } from '../types';
import { DocumentRequest } from '@/shared/types';
import { API_ROUTES } from '@/shared/constants';

/**
 * Get all document requests
 */
export async function getRequests(): Promise<DocumentRequest[]> {
    const response = await fetch(API_ROUTES.REQUESTS.GET_ALL);

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
    const response = await fetch(API_ROUTES.REQUESTS.CREATE, {
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
 * Delete a request
 */
export async function deleteRequest(id: string): Promise<void> {
    const response = await fetch(API_ROUTES.REQUESTS.DELETE(id), {
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
    const response = await fetch(API_ROUTES.REQUESTS.GET_BY_ID(id));

    if (response.status === 404) {
        return undefined;
    }

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch request');
    }

    return response.json();
}