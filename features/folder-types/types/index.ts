import { AppDocumentType, DocumentTypeId } from '../../document-types';

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
  requiredDocuments: DocumentTypeId[];
  createdById?: string;
}

export interface UpdateFolderTypeParams {
  name?: string;
  description?: string;
  requiredDocuments?: DocumentTypeId[];
}
