import type { AppDocumentType } from '@/features/document-types/types/zod';
import type { DocumentType } from '@/lib/prisma/generated/client';

/**
 * Convert Prisma DocumentType to App DocumentType
 */
export function documentTypeToAppDocumentType(
  documentType: DocumentType,
): AppDocumentType {
  return {
    id: documentType.id,
    createdAt: documentType.createdAt,
    label: documentType.label,
    description: documentType.description || null,
    acceptedFormats: documentType.acceptedFormats,
    maxSizeMB: documentType.maxSizeMB,
  };
}
