import { REQUEST_STATUS, RequestStatus } from '@/shared/constants';
import * as storage from '@/features/storage/api';
import { CreateRequestParams } from '../types';
import { DocumentRequest } from '@/shared/types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'requests';
const DEFAULT_EXPIRATION_DAYS = 7;

/**
 * Get all document requests
 */
export async function getRequests(): Promise<DocumentRequest[]> {
    try {
        const storedRequests = storage.getItem<DocumentRequest[]>(STORAGE_KEY);
        if (!storedRequests) return [];

        // Convert date strings to Date objects
        return storedRequests.map((req) => ({
            ...req,
            createdAt: new Date(req.createdAt),
            expiresAt: new Date(req.expiresAt),
            updatedAt: new Date(req.updatedAt)
        }));
    } catch (error) {
        console.error('Error fetching requests:', error);
        throw new Error('Failed to fetch requests');
    }
}

/**
 * Create a new document request
 */
export async function createRequest(params: CreateRequestParams): Promise<DocumentRequest> {
    try {
        const { civilId, requestedDocuments, expirationDays = DEFAULT_EXPIRATION_DAYS } = params;
        const now = new Date();

        const newRequest: DocumentRequest = {
            id: uuidv4(),
            civilId,
            requestedDocuments,
            status: REQUEST_STATUS.PENDING,
            createdAt: now,
            expiresAt: new Date(now.getTime() + expirationDays * 24 * 60 * 60 * 1000),
            updatedAt: now
        };

        const requests = await getRequests();
        const updatedRequests = [...requests, newRequest];

        storage.setItem(STORAGE_KEY, updatedRequests);
        return newRequest;
    } catch (error) {
        console.error('Error creating request:', error);
        throw new Error('Failed to create request');
    }
}

/**
 * Update request status
 */
export async function updateRequestStatus(id: string, status: RequestStatus): Promise<DocumentRequest> {
    try {
        const requests = await getRequests();
        let updatedRequest: DocumentRequest | undefined;

        const updatedRequests = requests.map(request => {
            if (request.id === id) {
                updatedRequest = {
                    ...request,
                    status,
                    updatedAt: new Date()
                };
                return updatedRequest;
            }
            return request;
        });

        if (!updatedRequest) {
            throw new Error(`Request with ID ${id} not found`);
        }

        storage.setItem(STORAGE_KEY, updatedRequests);
        return updatedRequest;
    } catch (error) {
        console.error('Error updating request status:', error);
        throw new Error('Failed to update request status');
    }
}

/**
 * Delete a request
 */
export async function deleteRequest(id: string): Promise<void> {
    try {
        const requests = await getRequests();
        const filteredRequests = requests.filter(request => request.id !== id);
        storage.setItem(STORAGE_KEY, filteredRequests);
    } catch (error) {
        console.error('Error deleting request:', error);
        throw new Error('Failed to delete request');
    }
}

/**
 * Get a single request by ID
 */
export async function getRequestById(id: string): Promise<DocumentRequest | undefined> {
    try {
        const requests = await getRequests();
        return requests.find(request => request.id === id);
    } catch (error) {
        console.error('Error fetching request:', error);
        throw new Error('Failed to fetch request');
    }
}