// features/folders/api/folderApi.ts
import { API_ROUTES } from '@/shared/constants';
import { Folder, CreateFolderParams, FolderWithRelations } from '../types';

// Get all folders
export async function getFolders(withStats: boolean = false): Promise<Array<Folder & { requestsCount?: number }>> {
    const url = withStats
        ? `${API_ROUTES.FOLDERS.GET_ALL}?withStats=true`
        : API_ROUTES.FOLDERS.GET_ALL;

    const response = await fetch(url);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch folders');
    }

    return response.json();
}

// Get a folder by ID
export async function getFolderById(id: string, includeRelations: boolean = false): Promise<FolderWithRelations | null> {
    const url = includeRelations
        ? `${API_ROUTES.FOLDERS.GET_BY_ID(id)}?includeRelations=true`
        : API_ROUTES.FOLDERS.GET_BY_ID(id);

    const response = await fetch(url);

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch folder');
    }

    return response.json();
}

// Create a new folder
export async function createFolder(params: CreateFolderParams): Promise<Folder> {
    const response = await fetch(API_ROUTES.FOLDERS.CREATE, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create folder');
    }

    return response.json();
}

// Update a folder
export async function updateFolder(id: string, params: CreateFolderParams): Promise<Folder> {
    const response = await fetch(API_ROUTES.FOLDERS.UPDATE(id), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update folder');
    }

    return response.json();
}

// Delete a folder
export async function deleteFolder(id: string): Promise<void> {
    const response = await fetch(API_ROUTES.FOLDERS.DELETE(id), {
        method: 'DELETE',
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete folder');
    }
}

// Get all requests in a folder
export async function getFolderRequests(folderId: string) {
    const response = await fetch(API_ROUTES.FOLDERS.GET_REQUESTS(folderId));

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch folder requests');
    }

    return response.json();
}

// Add a request to a folder
export async function addRequestToFolder(folderId: string, requestId: string): Promise<void> {
    const response = await fetch(API_ROUTES.FOLDERS.ADD_REQUEST(folderId), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add request to folder');
    }
}

// Remove a request from a folder
export async function removeRequestFromFolder(folderId: string, requestId: string): Promise<void> {
    const response = await fetch(API_ROUTES.FOLDERS.REMOVE_REQUEST(folderId, requestId), {
        method: 'DELETE',
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to remove request from folder');
    }
}