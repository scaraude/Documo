import { AppDocumentType } from '@/shared/constants';
import { DocumentRequest, AppDocument } from '@/shared/types';
import { FolderType } from '@/features/folder-types/types';

export interface Folder {
    id: string;
    name: string;
    description: string;
    requestedDocuments: AppDocumentType[];
    createdAt: Date;
    updatedAt: Date;

    // Propriétés pour calculer le status
    archivedAt?: Date;
    completedAt?: Date;
    firstRequestCreatedAt?: Date;
    lastActivityAt: Date;

    expiresAt?: Date;
    createdById?: string;
    sharedWith: string[];

    // Relations
    folderTypeId?: string;
    folderType?: FolderType;
}

export interface FolderWithRelations extends Folder {
    requests?: DocumentRequest[];
    documents?: AppDocument[];
    folderType?: FolderType;
}

export interface CreateFolderParams {
    name: string;
    description?: string;
    folderTypeId: string;
    expiresAt: Date | null;
    requestedDocuments: AppDocumentType[];
    createdById?: string;
    sharedWith?: string[];
}

// Computed status type
export type ComputedFolderStatus = 'ACTIVE' | 'ARCHIVED' | 'COMPLETED' | 'PENDING';