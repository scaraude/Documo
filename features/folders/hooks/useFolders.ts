// features/folders/hooks/useFolder.ts
'use client'
import { tr } from 'date-fns/locale';
import { trpc } from '../../../lib/trpc/client';

export function useFolders() {
    const getAllFolders = () => trpc.folder.getAll.useQuery();

    const getFolderById = (id: string) => trpc.folder.getById.useQuery({ id });

    const createFolderMutation = trpc.folder.create.useMutation();

    const deleteFolderMutation = trpc.folder.delete.useMutation();

    const removeRequestFromFolderMutation = trpc.folder.removeRequestFromFolder.useMutation();

    return {
        getAllFolders,
        getFolderById,
        createFolderMutation,
        deleteFolderMutation,
        removeRequestFromFolderMutation
    };
}