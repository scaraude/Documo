import type { DocumentType } from '@/lib/prisma/generated/client';
import type { AppDocumentType } from '../constants';

/**
 * Convert Prisma DocumentType to App DocumentType
 */
export function documentTypeToAppDocumentType(
  documentType: DocumentType,
): AppDocumentType {
  return {
    id: documentType.id,
    label: documentType.label,
    description: documentType.description || undefined,
    acceptedFormats: documentType.acceptedFormats,
    maxSizeMB: documentType.maxSizeMB,
  };
}
