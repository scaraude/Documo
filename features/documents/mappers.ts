import { Prisma } from '@/lib/prisma';
import { AppDocument, AppDocumentToUpload } from '../../shared/types';
import { documentTypeToAppDocumentType } from '../../shared/mapper/prismaMapper';

// Type du modèle Document de Prisma
type PrismaDocument = Prisma.DocumentGetPayload<{
  include: { type: true };
}>;

/**
 * Convertir un document Prisma en document d'application
 */
export function prismaDocumentToAppDocument(
  prismaModel: PrismaDocument
): AppDocument {
  return {
    id: prismaModel.id,
    requestId: prismaModel.requestId,
    type: documentTypeToAppDocumentType(prismaModel.type),
    fileName: prismaModel.fileName,
    mimeType: prismaModel.mimeType,
    originalSize: prismaModel.originalSize,
    hash: prismaModel.hash,
    url: prismaModel.url,
    validationErrors: prismaModel.validationErrors || [],
    dek: prismaModel.DEK,
    createdAt: prismaModel.createdAt,
    updatedAt: prismaModel.updatedAt,
    uploadedAt: prismaModel.uploadedAt,
  };
}

/**
 * Convertir un document d'application en objet de création Prisma
 */
export function inputToPrismaCreateInput(
  appDocument: AppDocumentToUpload
): Prisma.DocumentCreateInput {
  return {
    id: appDocument.id,
    request: {
      connect: { id: appDocument.requestId },
    },
    type: {
      connect: { id: appDocument.typeId },
    },
    url: appDocument.url,
    hash: appDocument.hash,
    validationErrors: appDocument.validationErrors || [],
    DEK: appDocument.dek,
    fileName: appDocument.fileName,
    mimeType: appDocument.mimeType,
    originalSize: appDocument.originalSize,
    uploadedAt: appDocument.uploadedAt,
  };
}
