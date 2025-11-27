import type { DocumentType } from '@/lib/prisma/generated/client';
import type { AppDocumentType } from '../constants';

// Since DocumentType is now a model, we work directly with the ID strings
export const documentTypeToAppDocumentType = (
  documentType: DocumentType,
): AppDocumentType => {
  return documentType.id as AppDocumentType;
};

export const appDocumentTypeToDocumentTypeId = (
  appDocumentType: AppDocumentType,
): string => {
  return appDocumentType;
};

// Helper for working with arrays
export const documentTypesToAppDocumentTypes = (
  documentTypes: DocumentType[],
): AppDocumentType[] => {
  return documentTypes.map((dt) => dt.id as AppDocumentType);
};

export const appDocumentTypesToDocumentTypeIds = (
  appDocumentTypes: AppDocumentType[],
): string[] => {
  return appDocumentTypes;
};
