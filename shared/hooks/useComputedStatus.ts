import { DocumentRequest, AppDocument, ComputedRequestStatus, ComputedDocumentStatus } from '@/shared/types';
import { ComputedFolderStatus, Folder } from '@/features/folders/types';

export const useFolderStatus = (folder: Folder): ComputedFolderStatus => {
    if (folder.archivedAt) return 'ARCHIVED';
    if (folder.completedAt) return 'COMPLETED';
    if (folder.firstRequestCreatedAt) return 'ACTIVE';
    return 'PENDING';
};

export const useRequestStatus = (request: DocumentRequest): ComputedRequestStatus => {
    if (request.completedAt) return 'COMPLETED';
    if (request.rejectedAt) return 'REJECTED';
    if (request.acceptedAt) return 'ACCEPTED';
    return 'PENDING';
};

export const useDocumentStatus = (document: AppDocument): ComputedDocumentStatus => {
    if (document.errorAt) return 'ERROR';
    if (document.invalidatedAt) return 'INVALID';
    if (document.validatedAt) return 'VALID';
    if (document.uploadedAt) return 'UPLOADED';
    return 'PENDING';
};

// Helpers pour les badges et styles
export const getFolderStatusBadgeClass = (status: ComputedFolderStatus) => {
    switch (status) {
        case 'ACTIVE': return 'bg-green-100 text-green-800';
        case 'ARCHIVED': return 'bg-gray-100 text-gray-800';
        case 'COMPLETED': return 'bg-blue-100 text-blue-800';
        case 'PENDING': return 'bg-yellow-100 text-yellow-800';
        default:
            const never: never = status;
            return never
    }
};

export const getRequestStatusBadgeClass = (status: ComputedRequestStatus) => {
    switch (status) {
        case 'ACCEPTED': return 'bg-green-100 text-green-800';
        case 'REJECTED': return 'bg-red-100 text-red-800';
        case 'COMPLETED': return 'bg-blue-100 text-blue-800';
        case 'PENDING': return 'bg-yellow-100 text-yellow-800';
        default:
            const never: never = status;
            return never
    }
};