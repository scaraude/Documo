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
    onSuccess: () => {
      // Invalidate all folders list
      utils.folder.getAll.invalidate();
      toast.success('Dossier créé avec succès');
    },
  });

  const deleteFolderMutation = trpc.folder.delete.useMutation({
    onError: createErrorHandler(),
    onSuccess: () => {
      // Invalidate all folders list since one was deleted
      utils.folder.getAll.invalidate();
      toast.success('Dossier supprimé avec succès');
    },
  });

  const removeRequestFromFolderMutation =
    trpc.folder.removeRequestFromFolder.useMutation({
      onError: createErrorHandler(),
      onSuccess: () => {
        // Invalidate the specific folder since its requests changed
        // We need to extract the folder ID from the request
        utils.folder.getAll.invalidate();
        // Also invalidate requests if we have request queries
        utils.requests?.getAll?.invalidate?.();
        toast.success('Demande retirée du dossier avec succès');
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
