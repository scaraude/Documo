import { AppDocumentType, FolderStatus } from '@/shared/constants';
import { AppDocument, DocumentRequest } from '@/shared/types';

export interface BaseFolder {
    id: string;
    name: string;
    description: string;
    status: FolderStatus;
    requestedDocuments: AppDocumentType[];
    createdAt: Date;
    updatedAt: Date;
    expiresAt?: Date | null;
    createdById?: string | null;
    sharedWith: string[];
}

export interface FolderWithRelations extends BaseFolder {
    requests?: DocumentRequest[];
    documents?: AppDocument[];
}

export interface FolderWithStats extends BaseFolder {
    requestsCount: number;
}

export type CreateFolderParams = Pick<BaseFolder, 'name' | 'description' | 'requestedDocuments'> & {
    expiresAt?: Date;
    createdById?: string;
    sharedWith?: string[];
};

export type UpdateFolderParams = Partial<Omit<BaseFolder, 'id' | 'createdAt' | 'updatedAt'>>;
