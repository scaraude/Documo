//features/requests/hooks/useRequest.ts
'use client'
import type { AppDocumentType } from '@/shared/constants';
import type { DocumentRequest } from '@/shared/types';
import { CreateRequestParams } from '../types';
import { trpc } from '@/lib/trpc/client';

export function useRequest() {
    // Get all requests with React Query caching
    const {
        data: requests = [],
        isLoading,
        error,
        isSuccess: isLoaded
    } = trpc.requests.list.useQuery();

    // Create request mutation
    const createRequestMutation = trpc.requests.create.useMutation({
        onSuccess: () => {
            // Invalidate and refetch requests
            trpc.useUtils().requests.list.invalidate();
        }
    });

    // Create request wrapper
    const createRequest = async (
        civilId: string,
        requestedDocuments: AppDocumentType[],
        folderId: string,
        expirationDays?: number
    ): Promise<DocumentRequest> => {
        const params: CreateRequestParams = {
            civilId,
            requestedDocuments,
            folderId,
            expirationDays
        };

        return createRequestMutation.mutateAsync(params);
    };

    // Combined loading state
    const isMutating = createRequestMutation.isPending;
    const combinedError = error || createRequestMutation.error;

    return {
        requests,
        isLoaded,
        isLoading: isLoading || isMutating,
        error: combinedError,
        createRequest,
    };
}