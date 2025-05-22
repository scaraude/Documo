import { AppDocumentType, FolderStatus } from '@/shared/constants';
import { DocumentRequest, AppDocument } from '@/shared/types';

export interface Folder {
    id: string;
    name: string;
    description: string;
    status: FolderStatus;
    requestedDocuments: AppDocumentType[];
    createdAt: Date;
    updatedAt: Date;
    expiresAt?: Date;
    createdById?: string;
    sharedWith: string[];
}

export interface FolderWithRelations extends Folder {
    requests?: DocumentRequest[];
    documents?: AppDocument[];
}

export interface CreateFolderParams {
    name: string;
    description?: string;
    requestedDocuments: AppDocumentType[];
    status?: FolderStatus;
    expiresAt?: Date;
    createdById?: string;
    sharedWith?: string[];
}

export interface UpdateFolderParams {
    name?: string;
    description?: string;
    status?: FolderStatus;
    requestedDocuments?: AppDocumentType[];
    expiresAt?: Date | null;
    sharedWith?: string[];
}