import { useState, useEffect } from 'react';
import { DocumentType } from '@/lib/prisma/generated/client';
import { getAllDocumentTypesCached } from '../repository/documentTypesRepository';

interface UseDocumentTypesReturn {
  documentTypes: DocumentType[];
  labelMap: Record<string, string>;
  isLoading: boolean;
  error: Error | null;
  getLabel: (id: string) => string;
  getDocumentType: (id: string) => DocumentType | undefined;
}

export const useDocumentTypes = (): UseDocumentTypesReturn => {
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDocumentTypes = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const types = await getAllDocumentTypesCached();
        setDocumentTypes(types);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocumentTypes();
  }, []);

  const labelMap = documentTypes.reduce((acc, docType) => {
    acc[docType.id] = docType.label;
    return acc;
  }, {} as Record<string, string>);

  const getLabel = (id: string): string => {
    return labelMap[id] || id;
  };

  const getDocumentType = (id: string): DocumentType | undefined => {
    return documentTypes.find(dt => dt.id === id);
  };

  return {
    documentTypes,
    labelMap,
    isLoading,
    error,
    getLabel,
    getDocumentType,
  };
};