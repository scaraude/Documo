import logger from '@/lib/logger';
import prisma from '@/lib/prisma';
import type { DocumentType } from '@/lib/prisma/generated/client';

export interface DocumentTypeWithValidation extends DocumentType {
  // Add computed validation helpers
  allowedMimeTypes: string[];
  maxSizeBytes: number;
}

export const getAllDocumentTypes = async (): Promise<DocumentType[]> => {
  try {
    logger.info(
      { operation: 'documentTypes.getAll' },
      'Fetching all document types',
    );

    const documentTypes = await prisma.documentType.findMany({
      orderBy: { label: 'asc' },
    });

    logger.info(
      { operation: 'documentTypes.getAll', count: documentTypes.length },
      'Successfully fetched document types',
    );

    return documentTypes;
  } catch (error) {
    logger.error(
      { operation: 'documentTypes.getAll', error: (error as Error).message },
      'Failed to fetch document types',
    );
    throw new Error('Failed to fetch document types');
  }
};

export const getDocumentTypeById = async (
  id: string,
): Promise<DocumentType | null> => {
  try {
    logger.info(
      { operation: 'documentTypes.getById', documentTypeId: id },
      'Fetching document type by ID',
    );

    const documentType = await prisma.documentType.findUnique({
      where: { id },
    });

    if (documentType) {
      logger.info(
        { operation: 'documentTypes.getById', documentTypeId: id },
        'Successfully fetched document type',
      );
    } else {
      logger.warn(
        { operation: 'documentTypes.getById', documentTypeId: id },
        'Document type not found',
      );
    }

    return documentType;
  } catch (error) {
    logger.error(
      {
        operation: 'documentTypes.getById',
        documentTypeId: id,
        error: (error as Error).message,
      },
      'Failed to fetch document type',
    );
    throw new Error('Failed to fetch document type');
  }
};

export const getDocumentTypesById = async (
  ids: string[],
): Promise<DocumentType[]> => {
  try {
    logger.info(
      {
        operation: 'documentTypes.getByIds',
        documentTypeIds: ids,
        count: ids.length,
      },
      'Fetching document types by IDs',
    );

    const documentTypes = await prisma.documentType.findMany({
      where: { id: { in: ids } },
      orderBy: { label: 'asc' },
    });

    logger.info(
      {
        operation: 'documentTypes.getByIds',
        requestedCount: ids.length,
        foundCount: documentTypes.length,
      },
      'Successfully fetched document types',
    );

    return documentTypes;
  } catch (error) {
    logger.error(
      {
        operation: 'documentTypes.getByIds',
        documentTypeIds: ids,
        error: (error as Error).message,
      },
      'Failed to fetch document types',
    );
    throw new Error('Failed to fetch document types');
  }
};

export const getDocumentTypeWithValidation = async (
  id: string,
): Promise<DocumentTypeWithValidation | null> => {
  try {
    const documentType = await getDocumentTypeById(id);
    if (!documentType) return null;

    // Convert format strings to MIME types
    const allowedMimeTypes = documentType.acceptedFormats.map((format) => {
      switch (format.toLowerCase()) {
        case 'pdf':
          return 'application/pdf';
        case 'jpg':
        case 'jpeg':
          return 'image/jpeg';
        case 'png':
          return 'image/png';
        default:
          return `application/${format}`;
      }
    });

    return {
      ...documentType,
      allowedMimeTypes,
      maxSizeBytes: documentType.maxSizeMB * 1024 * 1024, // Convert MB to bytes
    };
  } catch (error) {
    logger.error(
      {
        operation: 'documentTypes.getWithValidation',
        documentTypeId: id,
        error: (error as Error).message,
      },
      'Failed to fetch document type with validation',
    );
    throw new Error('Failed to fetch document type with validation');
  }
};

export const validateDocumentFile = async (
  documentTypeId: string,
  fileSize: number,
  mimeType: string,
): Promise<{ isValid: boolean; errors: string[] }> => {
  try {
    const documentType = await getDocumentTypeWithValidation(documentTypeId);

    if (!documentType) {
      return {
        isValid: false,
        errors: ['Type de document invalide'],
      };
    }

    const errors: string[] = [];

    // Check file size
    if (fileSize > documentType.maxSizeBytes) {
      errors.push(
        `La taille du fichier ne doit pas dépasser ${documentType.maxSizeMB} MB`,
      );
    }

    // Check MIME type
    if (!documentType.allowedMimeTypes.includes(mimeType)) {
      const allowedFormats = documentType.acceptedFormats.join(', ');
      errors.push(
        `Format de fichier non autorisé. Formats acceptés: ${allowedFormats}`,
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  } catch (error) {
    logger.error(
      {
        operation: 'documentTypes.validateFile',
        documentTypeId,
        error: (error as Error).message,
      },
      'Failed to validate document file',
    );
    return {
      isValid: false,
      errors: ['Erreur lors de la validation du fichier'],
    };
  }
};

// Cache for frequently accessed document types
let documentTypesCache: DocumentType[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getAllDocumentTypesCached = async (): Promise<DocumentType[]> => {
  const now = Date.now();

  if (documentTypesCache && now - cacheTimestamp < CACHE_DURATION) {
    logger.debug(
      { operation: 'documentTypes.getAllCached' },
      'Returning cached document types',
    );
    return documentTypesCache;
  }

  logger.info(
    { operation: 'documentTypes.getAllCached' },
    'Cache miss, fetching fresh document types',
  );
  documentTypesCache = await getAllDocumentTypes();
  cacheTimestamp = now;

  return documentTypesCache;
};

export const clearDocumentTypesCache = (): void => {
  logger.info(
    { operation: 'documentTypes.clearCache' },
    'Clearing document types cache',
  );
  documentTypesCache = null;
  cacheTimestamp = 0;
};
