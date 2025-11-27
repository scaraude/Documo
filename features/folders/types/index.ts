import type { FolderType } from '@/features/folder-types/types';
import type { AppDocumentType } from '@/shared/constants';
import type {
  DocumentRequest,
  DocumentRequestWithStatue,
} from '@/shared/types';

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
