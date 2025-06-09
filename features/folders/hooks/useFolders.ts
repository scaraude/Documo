'use client'

import { trpc } from '../../../lib/trpc/client';
import { computeFolderStatus, computeRequestStatus, computeDocumentStatus } from '@/shared/utils/computedStatus';

export function useFolders() {
    const getAllFolders = () => trpc.folder.getAll.useQuery(undefined, {
        select(data) {
            return data.map((folder) => { return { ...folder, status: computeFolderStatus(folder) } })
        }
    });

    const getFolderById = (id: string) => trpc.folder.getByIdWithRelations.useQuery({ id }, {
        select(folder) {
            return folder === null ? null : { ...folder, status: computeFolderStatus(folder), requests: folder.requests?.map(request => ({ ...request, status: computeRequestStatus(request) })), documents: folder.documents?.map(document => ({ ...document, status: computeDocumentStatus(document) })) }
        },
    });

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