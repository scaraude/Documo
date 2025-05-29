// features/folders/hooks/useFolder.ts
'use client'
import { useCallback, useEffect, useState } from 'react';
import * as folderApi from '../api/folderApi';
import { CreateFolderParams, Folder, FolderWithRelations } from '../types';

export function useFolder() {
    const [folders, setFolders] = useState<Array<Folder & { requestsCount?: number }>>([]);
    const [currentFolder, setCurrentFolder] = useState<FolderWithRelations | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Load all folders
    const loadFolders = useCallback(async (withStats: boolean = false) => {
        try {
            setIsLoading(true);
            const data = await folderApi.getFolders(withStats);
            setFolders(data);
            setIsLoaded(true);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Unknown error'));
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Load a specific folder
    const loadFolder = useCallback(async (id: string, includeRelations: boolean = false) => {
        try {
            setIsLoading(true);
            const folder = await folderApi.getFolderById(id, includeRelations);
            setCurrentFolder(folder);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to load folder'));
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Create a new folder
    const createFolder = async (params: CreateFolderParams) => {
        try {
            setIsLoading(true);
            const newFolder = await folderApi.createFolder(params);
            setFolders(prev => [...prev, newFolder]);
            return newFolder;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to create folder'));
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Update a folder
    const updateFolder = async (id: string, params: UpdateFolderParams) => {
        try {
            setIsLoading(true);
            const updatedFolder = await folderApi.updateFolder(id, params);

            setFolders(prev =>
                prev.map(folder => folder.id === id ? updatedFolder : folder)
            );

            if (currentFolder && currentFolder.id === id) {
                setCurrentFolder({
                    ...currentFolder,
                    ...updatedFolder
                });
            }

            return updatedFolder;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to update folder'));
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Delete a folder
    const deleteFolder = async (id: string) => {
        try {
            setIsLoading(true);
            await folderApi.deleteFolder(id);
            setFolders(prev => prev.filter(folder => folder.id !== id));

            if (currentFolder && currentFolder.id === id) {
                setCurrentFolder(null);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to delete folder'));
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Add a request to the current folder
    const addRequestToFolder = async (folderId: string, requestId: string) => {
        try {
            setIsLoading(true);
            await folderApi.addRequestToFolder(folderId, requestId);

            // If we have the current folder loaded with relations, update its requests
            if (currentFolder && currentFolder.id === folderId && currentFolder.requests) {
                // We would need to fetch the request to add it to the current folder's requests
                // This is a simplified version
                await loadFolder(folderId, true);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to add request to folder'));
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Remove a request from the current folder
    const removeRequestFromFolder = async (folderId: string, requestId: string) => {
        try {
            setIsLoading(true);
            await folderApi.removeRequestFromFolder(folderId, requestId);

            // If we have the current folder loaded with relations, update its requests
            if (currentFolder && currentFolder.id === folderId && currentFolder.requests) {
                setCurrentFolder({
                    ...currentFolder,
                    requests: currentFolder.requests.filter(req => req.id !== requestId)
                });
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to remove request from folder'));
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Load folders on component mount
    useEffect(() => {
        loadFolders();
    }, [loadFolders]);

    return {
        folders,
        currentFolder,
        isLoaded,
        isLoading,
        error,
        loadFolders,
        loadFolder,
        createFolder,
        updateFolder,
        deleteFolder,
        addRequestToFolder,
        removeRequestFromFolder
    };
}