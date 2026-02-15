'use client';

import {
  computeFolderStatus,
  computeRequestStatus,
} from '@/shared/utils/computedStatus';
import { toast } from 'sonner';
import { trpc } from '../../../lib/trpc/client';
import { useAuthErrorHandler } from '../../../shared/utils';

export function useFolders() {
  const { createErrorHandler } = useAuthErrorHandler();
  const utils = trpc.useUtils();

  const getAllFolders = () =>
    trpc.folder.getAll.useQuery(undefined, {
      select(data) {
        return data.map((folder) => {
          return { ...folder, status: computeFolderStatus(folder) };
        });
      },
    });

  const getFolderById = (id: string) =>
    trpc.folder.getByIdWithRelations.useQuery(
      { id },
      {
        select(folder) {
          return folder === null
            ? null
            : {
                ...folder,
                status: computeFolderStatus(folder),
                requests: folder.requests?.map((request) => ({
                  ...request,
                  status: computeRequestStatus(request),
                })),
              };
        },
      },
    );

  const createFolderMutation = trpc.folder.create.useMutation({
    onError: createErrorHandler(),
    onSuccess: async (folder) => {
      // Keep list and detail pages in sync after creation.
      await Promise.all([
        utils.folder.getAll.invalidate(),
        utils.folder.getByIdWithRelations.invalidate({ id: folder.id }),
      ]);
      toast.success('Dossier créé avec succès');
    },
  });

  const deleteFolderMutation = trpc.folder.delete.useMutation({
    onError: createErrorHandler(),
    onSuccess: async (_result, variables) => {
      // Remove stale data in list and detail.
      await Promise.all([
        utils.folder.getAll.invalidate(),
        utils.folder.getByIdWithRelations.invalidate({ id: variables.id }),
        utils.requests.getAll.invalidate(),
      ]);
      toast.success('Dossier supprimé avec succès');
    },
  });

  const removeRequestFromFolderMutation =
    trpc.folder.removeRequestFromFolder.useMutation({
      onError: createErrorHandler(),
      onSuccess: async (_result, variables) => {
        // Update impacted views after archival.
        await Promise.all([
          utils.folder.getAll.invalidate(),
          utils.folder.getByIdWithRelations.invalidate({
            id: variables.folderId,
          }),
          utils.requests.getAll.invalidate(),
          utils.requests.getById.invalidate({ id: variables.requestId }),
        ]);
        toast.success('Demande archivée avec succès');
      },
    });

  return {
    getAllFolders,
    getFolderById,
    createFolderMutation,
    deleteFolderMutation,
    removeRequestFromFolderMutation,
  };
}
