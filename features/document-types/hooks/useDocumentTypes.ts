import type { DocumentType } from '@/lib/prisma/generated/client';
import { trpc } from '@/lib/trpc/client';

interface UseDocumentTypesReturn {
  documentTypes: DocumentType[];
  isLoading: boolean;
  error: Error | null;
  getLabel: (doc: DocumentType) => string;
  getLabelById: (id: DocumentType["id"]) => string;
  getDocumentType: (id: string) => DocumentType | undefined;
}

/**
 * Simple hook for document types with basic caching
 * Document types don't change often, so we cache for 1 hour
 */
export const useDocumentTypes = (): UseDocumentTypesReturn => {
  const {
    data: documentTypes,
    isLoading,
    error,
  } = trpc.documentTypes.getAll.useQuery(undefined, {
    staleTime: 60 * 60 * 1000, // 1 hour - document types rarely change
    refetchOnWindowFocus: false,
  });

  const getLabelById = (id: string): string => {
    const docType = documentTypes?.find((dt: DocumentType) => dt.id === id);
    return docType ? docType.label : 'Unknown Document Type';
  }

  const getLabel = (docType: DocumentType): string => {
    return docType.label;
  };

  const getDocumentType = (id: string): DocumentType | undefined => {
    return documentTypes?.find((dt: DocumentType) => dt.id === id);
  };

  return {
    documentTypes: documentTypes || [],
    isLoading,
    error: error as Error | null,
    getLabel,
    getLabelById,
    getDocumentType,
  };
};
