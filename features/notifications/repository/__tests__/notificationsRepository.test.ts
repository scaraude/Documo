// features/notifications/repository/__tests__/notificationsRepository.test.ts
import {
    sendNotification,
    getPendingNotification,
    saveNotificationResponse,
    checkNotificationResponse
} from '../notificationsRepository';
import { APP_DOCUMENT_TYPES, DOCUMENT_REQUEST_STATUS } from '@/shared/constants';
import { DocumentRequest } from '@/shared/types';

// Mock Prisma
jest.mock('@/lib/prisma', () => {
    return {
        __esModule: true,
        default: {
            documentRequest: {
                upsert: jest.fn(),
                findFirst: jest.fn(),
                update: jest.fn()
            },
            notificationResponse: {
                create: jest.fn(),
                findFirst: jest.fn(),
                update: jest.fn()
            }
        },
    };
});

// Importer après le mock
import prisma from '@/lib/prisma';

// Typer le mock
const mockPrisma = prisma as jest.Mocked<typeof prisma> & {
    documentRequest: {
        upsert: jest.Mock;
        findFirst: jest.Mock;
        update: jest.Mock;
    };
    notificationResponse: {
        create: jest.Mock;
        findFirst: jest.Mock;
        update: jest.Mock;
    };
};

describe('Notifications Repository', () => {
    // Configuration commune
    const mockDate = new Date('2023-01-01');
    const expiryDate = new Date('2023-01-08'); // 7 jours plus tard

    const mockRequest: DocumentRequest = {
        id: 'req-1',
        civilId: '123456',
        requestedDocuments: [APP_DOCUMENT_TYPES.IDENTITY_CARD],
        status: DOCUMENT_REQUEST_STATUS.PENDING,
        createdAt: mockDate,
        expiresAt: expiryDate,
        updatedAt: mockDate
    };

    const mockPrismaRequest = {
        id: 'req-1',
        civilId: '123456',
        requestedDocuments: [APP_DOCUMENT_TYPES.IDENTITY_CARD],
        status: DOCUMENT_REQUEST_STATUS.PENDING,
        createdAt: mockDate,
        expiresAt: expiryDate,
        UpdatedAt: mockDate // Note la différence de casse
    };

    const mockPrismaResponse = {
        id: 'resp-1',
        requestId: 'req-1',
        response: 'ACCEPTED',
        timestamp: mockDate,
        request: mockPrismaRequest
    };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
        jest.setSystemTime(mockDate);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe('sendNotification', () => {
        it('devrait créer/mettre à jour une notification dans la base de données', async () => {
            // GIVEN
            mockPrisma.documentRequest.upsert.mockResolvedValue(mockPrismaRequest);

            // WHEN
            await sendNotification(mockRequest);

            // THEN
            expect(mockPrisma.documentRequest.upsert).toHaveBeenCalledWith({
                where: { id: 'req-1' },
                update: {},
                create: expect.objectContaining({
                    id: 'req-1',
                    civilId: '123456',
                    status: DOCUMENT_REQUEST_STATUS.PENDING
                })
            });
        });

        it('devrait gérer les erreurs lors de l\'envoi', async () => {
            // GIVEN
            mockPrisma.documentRequest.upsert.mockRejectedValue(new Error('DB error'));

            // WHEN/THEN
            await expect(sendNotification(mockRequest)).rejects.toThrow('Failed to send notification');
        });
    });

    describe('getPendingNotification', () => {
        it('devrait récupérer une notification en attente', async () => {
            // GIVEN
            mockPrisma.documentRequest.findFirst.mockResolvedValue(mockPrismaRequest);

            // WHEN
            const result = await getPendingNotification();

            // THEN
            expect(result).not.toBeNull();
            expect(result?.id).toBe('req-1');
            expect(mockPrisma.documentRequest.findFirst).toHaveBeenCalledWith({
                where: { status: 'PENDING' },
                orderBy: { createdAt: 'desc' }
            });
        });

        it('devrait retourner null si aucune notification en attente', async () => {
            // GIVEN
            mockPrisma.documentRequest.findFirst.mockResolvedValue(null);

            // WHEN
            const result = await getPendingNotification();

            // THEN
            expect(result).toBeNull();
        });
    });

    describe('saveNotificationResponse', () => {
        it('devrait sauvegarder une réponse de notification', async () => {
            // GIVEN
            mockPrisma.notificationResponse.create.mockResolvedValue(mockPrismaResponse);

            // WHEN
            await saveNotificationResponse('req-1', 'accepted');

            // THEN
            expect(mockPrisma.notificationResponse.create).toHaveBeenCalledWith({
                data: {
                    request: {
                        connect: { id: 'req-1' }
                    },
                    response: 'ACCEPTED'
                }
            });
        });

        it('devrait gérer les erreurs lors de la sauvegarde', async () => {
            // GIVEN
            mockPrisma.notificationResponse.create.mockRejectedValue(new Error('DB error'));

            // WHEN/THEN
            await expect(saveNotificationResponse('req-1', 'accepted')).rejects.toThrow('Failed to save response');
        });
    });

    describe('checkNotificationResponse', () => {
        it('devrait vérifier s\'il y a une réponse de notification', async () => {
            // GIVEN
            mockPrisma.notificationResponse.findFirst.mockResolvedValue(mockPrismaResponse);

            // WHEN
            const result = await checkNotificationResponse();

            // THEN
            expect(result).not.toBeNull();
            expect(result?.requestId).toBe('req-1');
            expect(result?.response).toBe('accepted');
        });

        it('devrait retourner null si aucune réponse trouvée', async () => {
            // GIVEN
            mockPrisma.notificationResponse.findFirst.mockResolvedValue(null);

            // WHEN
            const result = await checkNotificationResponse();

            // THEN
            expect(result).toBeNull();
        });
    });
});