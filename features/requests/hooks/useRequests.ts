//features/requests/hooks/useRequest.ts
'use client';
import { trpc } from '@/lib/trpc/client';

export function useRequests() {
  const utils = trpc.useUtils();

  const getAllRequests = () => trpc.requests.getAll.useQuery();

  const getById = (id: string) => trpc.requests.getById.useQuery({ id });

  const createRequestMutation = trpc.requests.create.useMutation({
    onSuccess: async (result, variables) => {
      // Keep requests and folder detail in sync after creating a request.
      await Promise.all([
        utils.requests.getAll.invalidate(),
        utils.folder.getAll.invalidate(),
        utils.folder.getByIdWithRelations.invalidate({
          id: variables.folderId,
        }),
        utils.requests.getById.invalidate({ id: result.requestId }),
      ]);
    },
  });

  return {
    getById,
    getAllRequests,
    createRequestMutation,
  };
}
