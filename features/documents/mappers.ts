import { Prisma } from "@/lib/prisma";
import { AppDocument, metadataSchema } from "../../shared/types";
import { prismaDocumentTypeToAppDocumentType } from "../../shared/mapper/prismaMapper";

// Type du modèle Document de Prisma
type PrismaDocument = Prisma.DocumentGetPayload<null>;

/**
 * Convertir un document Prisma en document d'application
 */
export function prismaDocumentToAppDocument(prismaModel: PrismaDocument): AppDocument {
    const metadata = metadataSchema.parse(prismaModel.metadata);

    return {
        id: prismaModel.id,
        requestId: prismaModel.requestId,
        type: prismaDocumentTypeToAppDocumentType(prismaModel.type),
        metadata,
        url: prismaModel.url || undefined,
        createdAt: prismaModel.createdAt,
        updatedAt: prismaModel.updatedAt,
        validationErrors: prismaModel.validationErrors || [],
        dek: prismaModel.DEK,
    };
}

/**
 * Convertir un document d'application en objet de création Prisma
 */
export function inputToPrismaCreateInput(appDocument: AppDocument): Prisma.DocumentCreateInput {
    return {
        id: appDocument.id,
        request: {
            connect: { id: appDocument.requestId }
        },
        type: appDocument.type,
        url: appDocument.url,
        hash: appDocument.metadata.hash,
        metadata: appDocument.metadata, // Add the required metadata property
        validationErrors: appDocument.validationErrors || [],
        folder: {
            connect: { id: appDocument.folderId }
        },
        DEK: appDocument.dek
    };
}
