// features/requests/api/requestApi.ts
import * as repository from '../repository/requestRepository';
import { CreateRequestParams } from '../types';
import { DocumentRequest } from '@/shared/types';
import { DocumentRequestStatus } from '@/shared/constants';

/**
 * Get all document requests
 */
export async function getRequests(): Promise<DocumentRequest[]> {
    return repository.getRequests();
}

/**
 * Create a new document request
 */
export async function createRequest(params: CreateRequestParams): Promise<DocumentRequest> {
    return repository.createRequest(params);
}

/**
 * Update request status
 */
export async function updateRequestStatus(id: string, status: DocumentRequestStatus): Promise<DocumentRequest> {
    return repository.updateRequestStatus(id, status);
}

/**
 * Delete a request
 */
export async function deleteRequest(id: string): Promise<void> {
    return repository.deleteRequest(id);
}

/**
 * Get a single request by ID
 */
export async function getRequestById(id: string): Promise<DocumentRequest | undefined> {
    const request = await repository.getRequestById(id);
    return request || undefined;
}