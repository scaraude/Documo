import { DocumentType } from '@/lib/prisma/generated/client';

// Legacy mapping - this will be replaced by database-driven labels
// Use the DocumentType repository for dynamic labels
export const getDocumentTypeLabel = (documentType: DocumentType): string => {
  return documentType.label;
};

export const getDocumentTypeDescription = (documentType: DocumentType): string | undefined => {
  return documentType.description;
};

// Helper to create a map from an array of DocumentType
export const createDocumentTypeLabelMap = (documentTypes: DocumentType[]): Record<string, string> => {
  return documentTypes.reduce((acc, docType) => {
    acc[docType.id] = docType.label;
    return acc;
  }, {} as Record<string, string>);
};
