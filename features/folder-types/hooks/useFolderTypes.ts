'use client'
import { trpc } from '../../../lib/trpc/client';

export function useFolderTypes() {
    const getAllFolderTypes = () => trpc.folderTypes.getAll.useQuery();

    const getFolderTypeById = (id: string) => trpc.folderTypes.getById.useQuery({ id });

    const createFolderTypeMutation = trpc.folderTypes.create.useMutation();

    const isFolderTypeInUsage = (id: string) => trpc.folderTypes.isInUsed.useQuery({ id });

    const deleteFolderTypeMutation = trpc.folderTypes.delete.useMutation();

    return {
        getAllFolderTypes,
        getFolderTypeById,
        createFolderTypeMutation,
        deleteFolderTypeMutation,
        isFolderTypeInUsage,
    };
}