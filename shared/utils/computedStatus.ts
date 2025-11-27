import type { ComputedFolderStatus, Folder } from '@/features/folders/types';
import type {
  AppDocument,
  ComputedDocumentStatus,
  ComputedRequestStatus,
  DocumentRequest,
} from '@/shared/types';

export const computeFolderStatus = (folder: Folder): ComputedFolderStatus => {
  if (folder.archivedAt) return 'ARCHIVED';
  if (folder.completedAt) return 'COMPLETED';
  return 'PENDING';
};

export const computeRequestStatus = (
  request: DocumentRequest,
): ComputedRequestStatus => {
  if (request.completedAt) return 'COMPLETED';
  if (request.rejectedAt) return 'REJECTED';
  if (request.acceptedAt) return 'ACCEPTED';
  return 'PENDING';
};

export const computeDocumentStatus = (
  document: AppDocument,
): ComputedDocumentStatus => {
  if (document.errorAt) return 'ERROR';
  if (document.invalidatedAt) return 'INVALID';
  if (document.validatedAt) return 'VALID';
  if (document.uploadedAt) return 'UPLOADED';
  return 'PENDING';
};
