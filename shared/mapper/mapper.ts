import { DocumentType } from '@/lib/prisma/generated/client';

// Helper to create a map from an array of DocumentType
export const createDocumentTypeLabelMap = (
  documentTypes: DocumentType[]
): Record<string, string> => {
  return documentTypes.reduce(
    (acc, docType) => {
      acc[docType.id] = docType.label;
      return acc;
    },
    {} as Record<string, string>
  );
};
