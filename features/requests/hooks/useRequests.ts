//features/requests/hooks/useRequest.ts
'use client';
import { trpc } from '@/lib/trpc/client';

export function useRequests() {
  const utils = trpc.useUtils();

  const getAllRequests = () => trpc.requests.getAll.useQuery();

  const getById = (id: string) => trpc.requests.getById.useQuery({ id });

  const createRequestMutation = trpc.requests.create.useMutation({
    onSuccess: () => {
      // Invalidate and refetch requests
      utils.requests.getAll.invalidate();
    },
  });

  return {
    getById,
    getAllRequests,
    createRequestMutation,
  };
}
