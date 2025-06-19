import { trpc } from '@/lib/trpc/client';
import { DocumentType } from '@/lib/prisma/generated/client';

interface UseDocumentTypesReturn {
  documentTypes: DocumentType[];
  labelMap: Record<string, string>;
  isLoading: boolean;
  error: Error | null;
  getLabel: (id: string) => string;
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

  // Create label map from document types
  const labelMap = (documentTypes || []).reduce(
    (acc, docType) => {
      acc[docType.id] = docType.label;
      return acc;
    },
    {} as Record<string, string>
  );

  const getLabel = (id: string): string => {
    return labelMap[id] || id;
  };

  const getDocumentType = (id: string): DocumentType | undefined => {
    return documentTypes?.find((dt: DocumentType) => dt.id === id);
  };

  return {
    documentTypes: documentTypes || [],
    labelMap,
    isLoading,
    error: error as Error | null,
    getLabel,
    getDocumentType,
  };
};
