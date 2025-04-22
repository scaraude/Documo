import { DocumentRequest, CreateRequestParams } from '../types';

const STORAGE_KEY = 'requests';
const DEFAULT_EXPIRATION_DAYS = 7;

/**
 * Get all document requests
 */
export async function getRequests(): Promise<DocumentRequest[]> {
    // Using try/catch for future API error handling
    try {
        const storedRequests = localStorage.getItem(STORAGE_KEY);
        if (!storedRequests) return [];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return JSON.parse(storedRequests).map((req: any) => ({
            ...req,
            createdAt: new Date(req.createdAt),
            expiresAt: new Date(req.expiresAt),
            lastUpdatedAt: new Date(req.lastUpdatedAt)
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
            id: `req_${now.getTime()}_${Math.random().toString(36).substr(2, 9)}`,
            civilId,
            requestedDocuments,
            status: 'pending',
            createdAt: now,
            expiresAt: new Date(now.getTime() + expirationDays * 24 * 60 * 60 * 1000),
            lastUpdatedAt: now
        };

        const requests = await getRequests();
        const updatedRequests = [...requests, newRequest];

        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRequests));
        return newRequest;
    } catch (error) {
        console.error('Error creating request:', error);
        throw new Error('Failed to create request');
    }
}

/**
 * Update request status
 */
export async function updateRequestStatus(id: string, status: DocumentRequest['status']): Promise<DocumentRequest> {
    try {
        const requests = await getRequests();
        let updatedRequest: DocumentRequest | undefined;

        const updatedRequests = requests.map(request => {
            if (request.id === id) {
                updatedRequest = {
                    ...request,
                    status,
                    lastUpdatedAt: new Date()
                };
                return updatedRequest;
            }
            return request;
        });

        if (!updatedRequest) {
            throw new Error(`Request with ID ${id} not found`);
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRequests));
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
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredRequests));
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