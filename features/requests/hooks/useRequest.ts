'use client'
import { useState, useEffect } from 'react';
import * as requestsApi from '../api/requestApi';
import type { AppDocumentType } from '@/shared/constants';
import { DocumentRequest } from '@/shared/types';

export function useRequest() {
    const [requests, setRequests] = useState<DocumentRequest[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Load all requests on component mount
    useEffect(() => {
        async function loadRequests() {
            try {
                setIsLoading(true);
                const data = await requestsApi.getRequests();
                setRequests(data);
                setIsLoaded(true);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Unknown error'));
            } finally {
                setIsLoading(false);
            }
        }

        loadRequests();
    }, []);

    // Create request wrapper
    const createRequest = async (civilId: string, requestedDocuments: AppDocumentType[], folderId: string, expirationDays?: number) => {
        try {
            setIsLoading(true);
            const newRequest = await requestsApi.createRequest({
                civilId,
                requestedDocuments,
                expirationDays,
                folderId,
            });

            setRequests(prev => [...prev, newRequest]);
            return newRequest;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to create request'));
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Delete request
    const deleteRequest = async (id: string) => {
        try {
            setIsLoading(true);
            await requestsApi.deleteRequest(id);
            setRequests(prev => prev.filter(req => req.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to delete request'));
        } finally {
            setIsLoading(false);
        }
    };

    return {
        requests,
        isLoaded,
        isLoading,
        error,
        createRequest,
        deleteRequest
    };
}