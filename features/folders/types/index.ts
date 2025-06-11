import { AppDocumentType } from '@/shared/constants';
import { DocumentRequest, DocumentRequestWithStatue, AppDocumentWithStatus } from '@/shared/types';
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
    lastActivityAt: Date;

    expiresAt?: Date;
    createdById?: string;

    // Relations
    folderTypeId?: string;
    folderType?: FolderType;
}

export interface FolderWithStatus extends Folder {
    status: ComputedFolderStatus;
}

export interface FolderWithRelations extends Folder {
    requests?: DocumentRequest[];
    folderType?: FolderType;
}

export interface FolderWithRelationsAndStatus extends FolderWithStatus {
    requests?: DocumentRequestWithStatue[];
    documents?: AppDocumentWithStatus[];
    folderType?: FolderType;
}

export interface CreateFolderParams {
    name: string;
    description?: string;
    folderTypeId: string;
    expiresAt: Date | null;
    requestedDocuments: AppDocumentType[];
    createdById?: string;
}

// Computed status type
export type ComputedFolderStatus = 'ARCHIVED' | 'COMPLETED' | 'PENDING';