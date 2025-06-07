//features/requests/hooks/useRequest.ts
'use client'
import type { DocumentRequest } from '@/shared/types';
import { CreateRequestParams } from '../types';
import { trpc } from '@/lib/trpc/client';

export function useRequests() {

    const getAllRequests = () => trpc.requests.getAll.useQuery();

    // Create request wrapper
    const createRequest = async (params: CreateRequestParams): Promise<DocumentRequest> => {
        return trpc.requests.create.useMutation({
            onSuccess: () => {
                // Invalidate and refetch requests
                trpc.useUtils().requests.getAll.invalidate();
            }
        }).mutateAsync(params);
    };


    return {
        getAllRequests,
        createRequest
    };
}