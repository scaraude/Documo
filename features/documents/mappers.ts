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
        validationErrors: prismaModel.validationErrors || []
    };
}