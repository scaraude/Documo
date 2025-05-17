// features/documents/repository/documentsRepository.ts
import prisma, { Prisma } from '@/lib/prisma';
import { AppDocument, metadataSchema } from '@/shared/types';
import { DocumentStatus, AppDocumentType } from '@/shared/constants/documents/types';

// Type du modèle Document de Prisma
type PrismaDocument = Prisma.DocumentGetPayload<null>;

/**
 * Convertir un document Prisma en document d'application
 */
function toAppModel(prismaModel: PrismaDocument): AppDocument {
    const metadata = metadataSchema.parse(prismaModel.metadata);

    return {
        id: prismaModel.id,
        requestId: prismaModel.requestId,
        type: prismaModel.type as AppDocumentType,
        status: prismaModel.status as DocumentStatus,
        metadata,
        url: prismaModel.url || undefined,
        createdAt: prismaModel.createdAt,
        updatedAt: prismaModel.updatedAt,
        validationErrors: prismaModel.validationErrors || []
    };
}

/**
 * Convertir un document d'application en objet de création Prisma
 */
function toPrismaCreateInput(appDocument: AppDocument): Prisma.DocumentCreateInput {
    return {
        id: appDocument.id,
        request: {
            connect: { id: appDocument.requestId }
        },
        type: appDocument.type,
        status: appDocument.status,
        metadata: appDocument.metadata,
        url: appDocument.url,
        hash: appDocument.metadata.hash,
        validationErrors: appDocument.validationErrors || [],
    };
}

/**
 * Get all documents
 */
export async function getDocuments(): Promise<AppDocument[]> {
    try {
        const documents = await prisma.document.findMany();
        return documents.map(toAppModel);
    } catch (error) {
        console.error('Error fetching documents from database:', error);
        throw new Error('Failed to fetch documents');
    }
}

/**
 * Upload a new document
 */
export async function uploadDocument(document: AppDocument): Promise<AppDocument> {
    try {
        // Créer l'entrée en base de données
        const createdDocument = await prisma.document.create({
            data: toPrismaCreateInput(document)
        });

        return toAppModel(createdDocument);
    } catch (error) {
        console.error('Error uploading document to database:', error);
        throw new Error('Failed to upload document');
    }
}

/**
 * Update document status
 */
export async function updateDocumentStatus(id: string, status: DocumentStatus): Promise<AppDocument> {
    try {
        const updatedDocument = await prisma.document.update({
            where: { id },
            data: { status }
        });

        return toAppModel(updatedDocument);
    } catch (error) {
        // Gérer les erreurs spécifiques
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                throw new Error(`Document with ID ${id} not found`);
            }
        }

        console.error('Error updating document status in database:', error);
        throw new Error('Failed to update document status');
    }
}

/**
 * Delete a document
 */
export async function deleteDocument(id: string): Promise<void> {
    try {
        await prisma.document.delete({
            where: { id }
        });
    } catch (error) {
        // Gérer les erreurs spécifiques
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                throw new Error(`Document with ID ${id} not found`);
            }
        }

        console.error('Error deleting document from database:', error);
        throw new Error('Failed to delete document');
    }
}

/**
 * Get a document by ID
 */
export async function getDocument(documentId: string): Promise<AppDocument | null> {
    try {
        const document = await prisma.document.findUnique({
            where: { id: documentId }
        });

        return document ? toAppModel(document) : null;
    } catch (error) {
        console.error('Error fetching document from database:', error);
        throw new Error('Failed to fetch document');
    }
}

/**
 * Get documents by request ID
 */
export async function getDocumentsByRequest(requestId: string): Promise<AppDocument[]> {
    try {
        const documents = await prisma.document.findMany({
            where: { requestId }
        });

        return documents.map(toAppModel);
    } catch (error) {
        console.error('Error fetching documents by request from database:', error);
        throw new Error('Failed to fetch documents by request');
    }
}