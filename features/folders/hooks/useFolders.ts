'use client';

import { trpc } from '../../../lib/trpc/client';
import {
  computeFolderStatus,
  computeRequestStatus,
} from '@/shared/utils/computedStatus';
import { useAuthErrorHandler } from '../../../shared/utils';

export function useFolders() {
  const { createErrorHandler } = useAuthErrorHandler();
  const getAllFolders = () =>
    trpc.folder.getAll.useQuery(undefined, {
      select(data) {
        return data.map(folder => {
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
                requests: folder.requests?.map(request => ({
                  ...request,
                  status: computeRequestStatus(request),
                })),
              };
        },
      }
    );

  const createFolderMutation = trpc.folder.create.useMutation({
    onError: createErrorHandler(),
  });

  const deleteFolderMutation = trpc.folder.delete.useMutation({
    onError: createErrorHandler(),
  });

  const removeRequestFromFolderMutation =
    trpc.folder.removeRequestFromFolder.useMutation({
      onError: createErrorHandler(),
    });

  return {
    getAllFolders,
    getFolderById,
    createFolderMutation,
    deleteFolderMutation,
    removeRequestFromFolderMutation,
  };
}
