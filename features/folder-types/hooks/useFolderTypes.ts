'use client';
import { trpc } from '../../../lib/trpc/client';
import { useAuthErrorHandler } from '@/shared/utils';
import { toast } from 'sonner';

export function useFolderTypes() {
  const { createErrorHandler } = useAuthErrorHandler();
  const utils = trpc.useUtils();

  // Queries - error handling should be done at component level or globally
  const getAllFolderTypes = () => trpc.folderTypes.getAll.useQuery();

  const getFolderTypeById = (id: string) =>
    trpc.folderTypes.getById.useQuery({ id });

  // Mutations - can have error handling and cache invalidation
  const createFolderTypeMutation = trpc.folderTypes.create.useMutation({
    onError: createErrorHandler(),
    onSuccess: () => {
      // Invalidate all folder types queries to refresh the cache
      utils.folderTypes.getAll.invalidate();
      toast.success('Type de dossier créé avec succès');
    },
  });

  const isFolderTypeInUsage = (id: string) =>
    trpc.folderTypes.isInUsed.useQuery({ id });

  const deleteFolderTypeMutation = trpc.folderTypes.delete.useMutation({
    onError: createErrorHandler(),
    onSuccess: () => {
      // Invalidate all folder types queries to refresh the cache
      utils.folderTypes.getAll.invalidate();
      toast.success('Type de dossier supprimé avec succès');
    },
  });

  const updateFolderTypeMutation = trpc.folderTypes.update.useMutation({
    onError: createErrorHandler(),
    onSuccess: updatedFolderType => {
      // Invalidate specific folder type and list queries
      utils.folderTypes.getAll.invalidate();
      utils.folderTypes.getById.invalidate({ id: updatedFolderType.id });
      toast.success('Type de dossier mis à jour avec succès');
    },
  });

  return {
    getAllFolderTypes,
    getFolderTypeById,
    createFolderTypeMutation,
    updateFolderTypeMutation,
    deleteFolderTypeMutation,
    isFolderTypeInUsage,
  };
}
