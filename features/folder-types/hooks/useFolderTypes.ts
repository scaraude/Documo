'use client';
import { trpc } from '../../../lib/trpc/client';
import { useAuthErrorHandler } from '@/shared/utils';

export function useFolderTypes() {
  const { createErrorHandler } = useAuthErrorHandler();

  // Queries - error handling should be done at component level or globally
  const getAllFolderTypes = () => trpc.folderTypes.getAll.useQuery();

  const getFolderTypeById = (id: string) =>
    trpc.folderTypes.getById.useQuery({ id });

  // Mutations - can have error handling
  const createFolderTypeMutation = trpc.folderTypes.create.useMutation({
    onError: createErrorHandler(),
  });

  const isFolderTypeInUsage = (id: string) =>
    trpc.folderTypes.isInUsed.useQuery({ id });

  const deleteFolderTypeMutation = trpc.folderTypes.delete.useMutation({
    onError: createErrorHandler(),
  });

  return {
    getAllFolderTypes,
    getFolderTypeById,
    createFolderTypeMutation,
    deleteFolderTypeMutation,
    isFolderTypeInUsage,
  };
}
