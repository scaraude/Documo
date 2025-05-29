import { API_ROUTES } from '@/shared/constants';
import { FolderType, CreateFolderTypeParams, UpdateFolderTypeParams } from '../types';

// Get all folder types
export async function getFolderTypes(withStats: boolean = false): Promise<Array<FolderType & {
    foldersCount?: number;
    activeFoldersCount?: number;
}>> {
    const url = withStats
        ? `${API_ROUTES.FOLDER_TYPES.GET_ALL}?withStats=true`
        : API_ROUTES.FOLDER_TYPES.GET_ALL;

    const response = await fetch(url);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch folder types');
    }

    return response.json();
}

// Get a folder type by ID
export async function getFolderTypeById(id: string): Promise<FolderType | null> {
    const response = await fetch(API_ROUTES.FOLDER_TYPES.GET_BY_ID(id));

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch folder type');
    }

    return response.json();
}

// Create a new folder type
export async function createFolderType(params: CreateFolderTypeParams): Promise<FolderType> {
    const response = await fetch(API_ROUTES.FOLDER_TYPES.CREATE, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create folder type');
    }

    return response.json();
}

// Update a folder type
export async function updateFolderType(id: string, params: UpdateFolderTypeParams): Promise<FolderType> {
    const response = await fetch(API_ROUTES.FOLDER_TYPES.UPDATE(id), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update folder type');
    }

    return response.json();
}

// Delete a folder type
export async function deleteFolderType(id: string): Promise<void> {
    const response = await fetch(API_ROUTES.FOLDER_TYPES.DELETE(id), {
        method: 'DELETE',
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete folder type');
    }
}

// Check if folder type is in use
export async function checkFolderTypeUsage(id: string): Promise<{ isInUse: boolean }> {
    const response = await fetch(API_ROUTES.FOLDER_TYPES.CHECK_USAGE(id));

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to check folder type usage');
    }

    return response.json();
}