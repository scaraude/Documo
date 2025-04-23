'use client'
import { useState, useEffect } from 'react';
import { DocumentRequest } from '@/lib/api/types';
import * as requestsApi from '@/lib/api/requests';
import type { DocumentType, RequestStatus } from '@/shared/constants';

export function useDocumentRequest() {
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
    const createRequest = async (civilId: string, requestedDocuments: DocumentType[], expirationDays?: number) => {
        try {
            setIsLoading(true);
            const newRequest = await requestsApi.createRequest({
                civilId,
                requestedDocuments,
                expirationDays
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

    // Update request status
    const updateRequestStatus = async (id: string, status: RequestStatus) => {
        try {
            setIsLoading(true);
            const updatedRequest = await requestsApi.updateRequestStatus(id, status);
            setRequests(prev =>
                prev.map(req => req.id === id ? updatedRequest : req)
            );
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to update request'));
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
        updateRequestStatus,
        deleteRequest
    };
}