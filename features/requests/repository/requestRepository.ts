import prisma, { Prisma } from '@/lib/prisma';
import { CreateRequestParams } from '../types';
import { DocumentRequest } from '@/shared/types';
import { AppDocumentType } from '@/shared/constants';

// Mapper entre le type Prisma et le type App
type PrismaDocumentRequest = Prisma.DocumentRequestGetPayload<null>;

/**
 * Convertir un modèle Prisma en modèle d'application
 */
export function toAppModel(prismaModel: PrismaDocumentRequest): DocumentRequest {
    return {
        id: prismaModel.id,
        email: prismaModel.email,
        requestedDocuments: prismaModel.requestedDocuments as AppDocumentType[],
        createdAt: prismaModel.createdAt,
        expiresAt: prismaModel.expiresAt,
        updatedAt: prismaModel.updatedAt,
        acceptedAt: prismaModel.acceptedAt || undefined,
        rejectedAt: prismaModel.rejectedAt || undefined,
        completedAt: prismaModel.completedAt || undefined,
        firstDocumentUploadedAt: prismaModel.firstDocumentUploadedAt || undefined,
        folderId: prismaModel.folderId,
    };
}

/**
 * Get all document requests
 */
export async function getRequests(): Promise<DocumentRequest[]> {
    try {
        const requests = await prisma.documentRequest.findMany();
        return requests.map(toAppModel);
    } catch (error) {
        console.error('Error fetching requests from database:', error);
        throw new Error('Failed to fetch requests');
    }
}

/**
 * Create a new document request
 */
export async function createRequest(params: CreateRequestParams): Promise<DocumentRequest> {
    try {
        const { email, requestedDocuments, expirationDays = 7, folderId } = params;
        const now = new Date();

        const expiresAt = new Date(now.getTime() + expirationDays * 24 * 60 * 60 * 1000);

        const newRequest = await prisma.documentRequest.create({
            data: {
                email,
                requestedDocuments,
                expiresAt,
                folderId
            }
        });

        return toAppModel(newRequest);
    } catch (error) {
        console.error('Error creating request in database:', error);
        throw new Error('Failed to create request');
    }
}

/**
 * Delete a request
 */
export async function deleteRequest(id: string): Promise<void> {
    try {
        await prisma.documentRequest.delete({
            where: { id }
        });
    } catch (error) {
        console.error('Error deleting request from database:', error);
        throw new Error('Failed to delete request');
    }
}

/**
 * Get a single request by ID
 */
export async function getRequestById(id: string): Promise<DocumentRequest | null> {
    try {
        const request = await prisma.documentRequest.findUnique({
            where: { id }
        });

        return request ? toAppModel(request) : null;
    } catch (error) {
        console.error('Error fetching request from database:', error);
        throw new Error('Failed to fetch request');
    }
}