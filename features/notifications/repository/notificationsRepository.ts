// features/notifications/repository/notificationsRepository.ts
import prisma, { Prisma } from '@/lib/prisma';
import { DocumentRequest } from '@/shared/types';
import { NotificationResponse } from '../types';
import { AppDocumentType, DocumentRequestStatus } from '@/shared/constants';

// Types Prisma utilisés
type PrismaDocumentRequest = Prisma.DocumentRequestGetPayload<null>;

/**
 * Convertir un modèle Prisma en modèle d'application
 */
function toAppRequest(prismaModel: PrismaDocumentRequest): DocumentRequest {
    return {
        id: prismaModel.id,
        civilId: prismaModel.civilId,
        requestedDocuments: prismaModel.requestedDocuments as AppDocumentType[],
        status: prismaModel.status as DocumentRequestStatus,
        createdAt: prismaModel.createdAt,
        expiresAt: prismaModel.expiresAt,
        updatedAt: prismaModel.updatedAt
    };
}

/**
 * Envoyer une notification (créer une entrée en BDD)
 */
export async function sendNotification(request: DocumentRequest): Promise<void> {
    try {
        // Vérifier que la requête existe déjà ou la créer
        await prisma.documentRequest.upsert({
            where: { id: request.id },
            update: {},
            create: {
                id: request.id,
                civilId: request.civilId,
                requestedDocuments: request.requestedDocuments,
                status: request.status,
                expiresAt: request.expiresAt
            }
        });

        // On pourrait aussi créer une entrée dans une table de notifications si nécessaire
    } catch (error) {
        console.error('Error sending notification to database:', error);
        throw new Error('Failed to send notification');
    }
}

/**
 * Récupérer une notification en attente
 */
export async function getPendingNotification(): Promise<DocumentRequest | null> {
    try {
        // Cherche une demande avec le statut PENDING
        const pendingRequest = await prisma.documentRequest.findFirst({
            where: {
                status: 'PENDING'
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        if (!pendingRequest) return null;

        return toAppRequest(pendingRequest);
    } catch (error) {
        console.error('Error getting pending notification from database:', error);
        throw new Error('Failed to get notification');
    }
}

/**
 * Sauvegarder une réponse de notification
 */
export async function saveNotificationResponse(
    requestId: string,
    response: 'accepted' | 'rejected'
): Promise<void> {
    try {
        await prisma.notificationResponse.create({
            data: {
                request: {
                    connect: { id: requestId }
                },
                response: response === 'accepted' ? 'ACCEPTED' : 'REJECTED'
            }
        });
    } catch (error) {
        console.error('Error saving notification response to database:', error);
        throw new Error('Failed to save response');
    }
}

/**
 * Vérifier s'il y a une réponse de notification
 */
export async function checkNotificationResponse(): Promise<NotificationResponse | null> {
    try {
        // Rechercher la dernière réponse de notification non traitée
        const latestResponse = await prisma.notificationResponse.findFirst({
            where: {
                // Vous pourriez ajouter une condition ici pour "non traitée"
                // par exemple { processed: false }
            },
            orderBy: {
                timestamp: 'desc'
            },
            include: {
                request: true
            }
        });

        if (!latestResponse) return null;

        // Convertir en format d'application
        const response: NotificationResponse = {
            requestId: latestResponse.requestId,
            response: latestResponse.response === 'ACCEPTED' ? 'ACCEPTED' : 'REJECTED',
            timestamp: latestResponse.timestamp.toISOString()
        };

        // Dans une vraie implémentation, on marquerait la réponse comme "traitée"
        await prisma.notificationResponse.update({
            where: { id: latestResponse.id },
            data: { processed: true }
        });

        return response;
    } catch (error) {
        console.error('Error checking notification response from database:', error);
        throw new Error('Failed to check notification response');
    }
}