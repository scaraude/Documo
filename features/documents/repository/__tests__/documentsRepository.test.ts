import {
    getDocuments,
    uploadDocument,
    updateDocumentStatus,
    getDocument,
    getDocumentsByRequest
} from '../documentsRepository';
import { APP_DOCUMENT_TYPES, DocumentStatus } from '@/shared/constants/documents/types';
import { AppDocument } from '@/shared/types';
import prisma from '@/lib/prisma';

// Mock Prisma
jest.mock('@/lib/prisma', () => {
    return {
        __esModule: true,
        default: {
            document: {
                findMany: jest.fn(),
                findUnique: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
            }
        },
    };
});

// Typer le mock
const mockPrisma = prisma as jest.Mocked<typeof prisma> & {
    document: {
        findMany: jest.Mock;
        findUnique: jest.Mock;
        create: jest.Mock;
        update: jest.Mock;
        delete: jest.Mock;
    }
};

describe('Documents Repository', () => {
    // Configuration commune
    const mockDate = new Date('2023-01-01');

    const mockPrismaDocument = {
        id: 'doc-1',
        requestId: 'req-1',
        type: APP_DOCUMENT_TYPES.IDENTITY_CARD,
        status: DocumentStatus.UPLOADED,
        metadata: {
            name: 'id-card.jpg',
            type: 'image/jpeg',
            size: 1024,
            lastModified: Date.now()
        },
        url: 'blob:12345',
        hash: 'hash123',
        createdAt: mockDate,
        updatedAt: mockDate,
        validationErrors: []
    };

    const mockAppDocument: AppDocument = {
        id: 'doc-1',
        requestId: 'req-1',
        type: APP_DOCUMENT_TYPES.IDENTITY_CARD,
        status: DocumentStatus.UPLOADED,
        metadata: {
            name: 'id-card.jpg',
            type: 'image/jpeg',
            size: 1024,
            lastModified: Date.now()
        },
        url: 'blob:12345',
        createdAt: mockDate,
        updatedAt: mockDate,
        validationErrors: []
    };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
        jest.setSystemTime(mockDate);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe('getDocuments', () => {
        it('devrait récupérer tous les documents de la base de données', async () => {
            // GIVEN
            mockPrisma.document.findMany.mockResolvedValue([mockPrismaDocument]);

            // WHEN
            const result = await getDocuments();

            // THEN
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe('doc-1');
            expect(mockPrisma.document.findMany).toHaveBeenCalledTimes(1);
        });

        it('devrait gérer les erreurs de base de données', async () => {
            // GIVEN
            mockPrisma.document.findMany.mockRejectedValue(new Error('DB error'));

            // WHEN/THEN
            await expect(getDocuments()).rejects.toThrow('Failed to fetch documents');
        });
    });

    describe('uploadDocument', () => {
        it('devrait créer un nouveau document dans la base de données', async () => {
            // GIVEN
            mockPrisma.document.create.mockResolvedValue(mockPrismaDocument);

            // WHEN
            const result = await uploadDocument(mockAppDocument);

            // THEN
            expect(result.id).toBe('doc-1');
            expect(result.type).toBe(APP_DOCUMENT_TYPES.IDENTITY_CARD);
            expect(mockPrisma.document.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    id: 'doc-1',
                    type: APP_DOCUMENT_TYPES.IDENTITY_CARD,
                    status: DocumentStatus.UPLOADED
                })
            });
        });

        it('devrait gérer les erreurs lors du téléchargement', async () => {
            // GIVEN
            mockPrisma.document.create.mockRejectedValue(new Error('Upload error'));

            // WHEN/THEN
            await expect(uploadDocument(mockAppDocument)).rejects.toThrow('Failed to upload document');
        });
    });

    describe('updateDocumentStatus', () => {
        it('devrait mettre à jour le statut d\'un document', async () => {
            // GIVEN
            const updatedDocument = {
                ...mockPrismaDocument,
                status: DocumentStatus.VALID,
                updatedAt: new Date('2023-01-02')
            };

            mockPrisma.document.update.mockResolvedValue(updatedDocument);

            // WHEN
            const result = await updateDocumentStatus('doc-1', DocumentStatus.VALID);

            // THEN
            expect(result.status).toBe(DocumentStatus.VALID);
            expect(mockPrisma.document.update).toHaveBeenCalledWith({
                where: { id: 'doc-1' },
                data: { status: DocumentStatus.VALID }
            });
        });

        it('devrait gérer les erreurs pour document inexistant', async () => {
            // GIVEN
            const notFoundError = new Error('Record not found');
            // Ajouter la propriété code manuellement
            Object.defineProperty(notFoundError, 'code', { value: 'P2025' });
            mockPrisma.document.update.mockRejectedValue(notFoundError);

            // WHEN/THEN
            await expect(updateDocumentStatus('not-exists', DocumentStatus.VALID))
                .rejects.toThrow('Document with ID not-exists not found');
        });
    });

    describe('getDocument', () => {
        it('devrait récupérer un document par ID', async () => {
            // GIVEN
            mockPrisma.document.findUnique.mockResolvedValue(mockPrismaDocument);

            // WHEN
            const result = await getDocument('doc-1');

            // THEN
            expect(result).not.toBeNull();
            expect(result?.id).toBe('doc-1');
            expect(mockPrisma.document.findUnique).toHaveBeenCalledWith({
                where: { id: 'doc-1' }
            });
        });

        it('devrait retourner null pour un ID inexistant', async () => {
            // GIVEN
            mockPrisma.document.findUnique.mockResolvedValue(null);

            // WHEN
            const result = await getDocument('not-exists');

            // THEN
            expect(result).toBeNull();
        });
    });

    describe('getDocumentsByRequest', () => {
        it('devrait récupérer tous les documents pour une demande', async () => {
            // GIVEN
            mockPrisma.document.findMany.mockResolvedValue([mockPrismaDocument]);

            // WHEN
            const result = await getDocumentsByRequest('req-1');

            // THEN
            expect(result).toHaveLength(1);
            expect(result[0].requestId).toBe('req-1');
            expect(mockPrisma.document.findMany).toHaveBeenCalledWith({
                where: { requestId: 'req-1' }
            });
        });

        it('devrait retourner un tableau vide si aucun document n\'est trouvé', async () => {
            // GIVEN
            mockPrisma.document.findMany.mockResolvedValue([]);

            // WHEN
            const result = await getDocumentsByRequest('unknown-req');

            // THEN
            expect(result).toEqual([]);
        });
    });
});