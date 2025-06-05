import { AppDocumentType } from '@/shared/constants';

export interface FolderType {
    id: string;
    name: string;
    description: string;
    requiredDocuments: AppDocumentType[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    createdById?: string;
}

export interface CreateFolderTypeParams {
    name: string;
    description: string;
    requiredDocuments: AppDocumentType[];
    createdById?: string;
}

export interface UpdateFolderTypeParams {
    name?: string;
    description?: string;
    requiredDocuments?: AppDocumentType[];
}