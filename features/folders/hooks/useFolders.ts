// features/folders/hooks/useFolder.ts
'use client'
import { useCallback, useEffect, useState } from 'react';
import * as folderApi from '../api/foldersApi';
import { Folder } from '../types';

export function useFolders() {
    const [folders, setFolders] = useState<Array<Folder & { requestsCount?: number }>>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Load all folders
    const loadFolders = useCallback(async (withStats: boolean = false) => {
        try {
            setIsLoading(true);
            const data = await folderApi.getFolders(withStats);
            setFolders(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Unknown error'));
        } finally {
            setIsLoading(false);
        }
    }, []);
    // Load folders on component mount
    useEffect(() => {
        loadFolders();
    }, [loadFolders]);

    return {
        folders,
        isLoading,
        error,
        loadFolders,
    };
}