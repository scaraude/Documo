'use client'
import { useState, useEffect, useCallback } from 'react';
import * as folderTypeApi from '../api/folderTypeApi';
import { FolderType, CreateFolderTypeParams, UpdateFolderTypeParams } from '../types';
import { trpc } from '../../../lib/trpc/client';

export function useFolderTypes() {
    const [folderTypes, setFolderTypes] = useState<Array<FolderType & {
        foldersCount?: number;
        activeFoldersCount?: number;
    }>>([]);
    const [currentFolderType, setCurrentFolderType] = useState<FolderType | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const getAllFolderTypes = () => trpc.folderTypes.getAll.useQuery()
    // Load all folder types
    const loadFolderTypes = useCallback(async (withStats: boolean = false) => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await folderTypeApi.getFolderTypes(withStats);
            setFolderTypes(data);
            setIsLoaded(true);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Unknown error'));
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Load a specific folder type
    const loadFolderType = useCallback(async (id: string) => {
        try {
            setIsLoading(true);
            setError(null);
            const folderType = await folderTypeApi.getFolderTypeById(id);
            setCurrentFolderType(folderType);
            return folderType;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to load folder type'));
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Create a new folder type
    const createFolderType = async (params: CreateFolderTypeParams) => {
        try {
            setIsLoading(true);
            setError(null);
            const newFolderType = await folderTypeApi.createFolderType(params);
            setFolderTypes(prev => [...prev, newFolderType]);
            return newFolderType;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to create folder type'));
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Update a folder type
    const updateFolderType = async (id: string, params: UpdateFolderTypeParams) => {
        try {
            setIsLoading(true);
            setError(null);
            const updatedFolderType = await folderTypeApi.updateFolderType(id, params);

            setFolderTypes(prev =>
                prev.map(ft => ft.id === id ? { ...ft, ...updatedFolderType } : ft)
            );

            if (currentFolderType && currentFolderType.id === id) {
                setCurrentFolderType(updatedFolderType);
            }

            return updatedFolderType;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to update folder type'));
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Delete a folder type
    const deleteFolderType = async (id: string) => {
        try {
            setIsLoading(true);
            setError(null);

            // Check if in use first
            const { isInUse } = await folderTypeApi.checkFolderTypeUsage(id);
            if (isInUse) {
                throw new Error('Ce type de dossier est utilisé et ne peut pas être supprimé');
            }

            await folderTypeApi.deleteFolderType(id);
            setFolderTypes(prev => prev.filter(ft => ft.id !== id));

            if (currentFolderType && currentFolderType.id === id) {
                setCurrentFolderType(null);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to delete folder type'));
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Check if a folder type is in use
    const checkUsage = async (id: string): Promise<boolean> => {
        try {
            const { isInUse } = await folderTypeApi.checkFolderTypeUsage(id);
            return isInUse;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to check usage'));
            throw err;
        }
    };

    // Load folder types on mount
    useEffect(() => {
        loadFolderTypes();
    }, [loadFolderTypes]);

    return {
        getAllFolderTypes,
        currentFolderType,
        isLoaded,
        isLoading,
        error,
        loadFolderTypes,
        loadFolderType,
        createFolderType,
        updateFolderType,
        deleteFolderType,
        checkUsage,
        // Computed values
        hasFolderTypes: folderTypes.length > 0,
        activeFolderTypesCount: folderTypes.filter(ft => !ft.deletedAt).length
    };
}