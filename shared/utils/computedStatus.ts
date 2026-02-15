import type { ComputedFolderStatus, Folder } from '@/features/folders/types';
import type {
  AppDocument,
  ComputedDocumentStatus,
  ComputedRequestStatus,
  DocumentRequest,
} from '@/shared/types';

export const computeFolderStatus = (
  folder: Folder & { requests?: Array<Pick<DocumentRequest, 'completedAt'>> },
): ComputedFolderStatus => {
  if (folder.archivedAt) return 'ARCHIVED';
  if (
    folder.requests &&
    folder.requests.length > 0 &&
    folder.requests.every((request) => Boolean(request.completedAt))
  ) {
    return 'COMPLETED';
  }
  if (folder.completedAt) return 'COMPLETED';
  return 'PENDING';
};

export const computeRequestStatus = (
  request: DocumentRequest & { documents?: AppDocument[] },
): ComputedRequestStatus => {
  if (request.rejectedAt) return 'REJECTED';

  const hasUploadedDocument =
    request.documents !== undefined
      ? request.documents.some((document) => !document.deletedAt)
      : Boolean(request.firstDocumentUploadedAt);

  if (request.completedAt || hasAllRequestedDocuments(request)) {
    return 'COMPLETED';
  }
  if (!request.acceptedAt) return 'PENDING';
  if (hasUploadedDocument) return 'IN_PROGRESS';
  if (request.acceptedAt) return 'ACCEPTED';
  return 'PENDING';
};

function hasAllRequestedDocuments(
  request: DocumentRequest & { documents?: AppDocument[] },
): boolean {
  if (!request.documents || request.requestedDocumentIds.length === 0) {
    return false;
  }

  const uploadedDocumentTypeIds = new Set(
    request.documents
      .filter((document) => !document.deletedAt)
      .map((document) => document.typeId),
  );

  return request.requestedDocumentIds.every((documentTypeId) =>
    uploadedDocumentTypeIds.has(documentTypeId),
  );
}

export const computeDocumentStatus = (
  document: AppDocument,
): ComputedDocumentStatus => {
  if (document.errorAt) return 'ERROR';
  if (document.invalidatedAt) return 'INVALID';
  if (document.validatedAt) return 'VALID';
  if (document.uploadedAt) return 'UPLOADED';
  return 'PENDING';
};
