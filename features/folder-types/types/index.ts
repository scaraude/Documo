import type {
  AppDocumentType,
  DocumentTypeId,
} from '../../document-types/types/zod';

export interface FolderType {
  id: string;
  name: string;
  description: string;
  requiredDocuments: AppDocumentType[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  createdByOrganizationId?: string;
}

export interface CreateFolderTypeParams {
  name: string;
  description?: string;
  requiredDocuments: DocumentTypeId[];
  createdByOrganizationId?: string;
}

export interface UpdateFolderTypeParams {
  name?: string;
  description?: string;
  requiredDocuments?: DocumentTypeId[];
}
