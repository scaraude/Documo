'use client'
import { useState, useEffect, useCallback } from 'react';
import * as folderTypeApi from '../api/folderTypeApi';
import { FolderType } from '../types';

export function useFolderType(id: string | null) {
    const [folderType, setFolderType] = useState<FolderType | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const loadFolderType = useCallback(async () => {
        if (!id) {
            setFolderType(null);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            const data = await folderTypeApi.getFolderTypeById(id);
            setFolderType(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to load folder type'));
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadFolderType();
    }, [loadFolderType]);

    return {
        folderType,
        isLoading,
        error,
        reload: loadFolderType
    };
}