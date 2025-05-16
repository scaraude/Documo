// features/request-templates/repository/__tests__/requestTemplatesRepository.test.ts
import {
    getTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    getTemplateById
} from '../requestTemplatesRepository';
import prisma from '@/lib/prisma';
import { DOCUMENT_TYPES } from '@/shared/constants';
import { CreateRequestTemplateParams } from '../../types';

// Mock prisma avec des types plus précis
jest.mock('@/lib/prisma', () => ({
    __esModule: true,
    default: {
        requestTemplate: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        }
    },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma> & {
    requestTemplate: {
        findMany: jest.Mock;
        findUnique: jest.Mock;
        create: jest.Mock;
        update: jest.Mock;
        delete: jest.Mock;
    }
};

describe('Request Templates Repository', () => {
    // Configuration commune
    const mockDate = new Date('2023-01-01');

    const mockPrismaTemplate = {
        id: '1',
        title: 'Test Template',
        requestedDocuments: [DOCUMENT_TYPES.IDENTITY_CARD],
        createdAt: mockDate
    };

    const mockTemplates = [mockPrismaTemplate];

    beforeEach(() => {
        jest.clearAllMocks();
        // Configuration d'horloge simulée pour les dates
        jest.useFakeTimers();
        jest.setSystemTime(mockDate);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe('getTemplates', () => {
        it('devrait récupérer tous les templates de la base de données', async () => {
            // GIVEN
            mockPrisma.requestTemplate.findMany.mockResolvedValue(mockTemplates);

            // WHEN
            const result = await getTemplates();

            // THEN
            expect(result).toEqual(mockTemplates);
            expect(mockPrisma.requestTemplate.findMany).toHaveBeenCalledTimes(1);
            expect(mockPrisma.requestTemplate.findMany).toHaveBeenCalledWith();
        });

        it('devrait retourner un tableau vide quand aucun template n\'existe', async () => {
            // GIVEN
            mockPrisma.requestTemplate.findMany.mockResolvedValue([]);

            // WHEN
            const result = await getTemplates();

            // THEN
            expect(result).toEqual([]);
            expect(mockPrisma.requestTemplate.findMany).toHaveBeenCalledTimes(1);
        });

        it('devrait gérer les erreurs de base de données', async () => {
            // GIVEN
            const dbError = new Error('Erreur de connexion à la DB');
            mockPrisma.requestTemplate.findMany.mockRejectedValue(dbError);

            // WHEN/THEN
            await expect(getTemplates()).rejects.toThrow('Failed to fetch templates');
            expect(mockPrisma.requestTemplate.findMany).toHaveBeenCalledTimes(1);
        });
    });

    describe('createTemplate', () => {
        it('devrait créer un nouveau template dans la base de données', async () => {
            // GIVEN
            const templateData: CreateRequestTemplateParams = {
                title: 'New Template',
                requestedDocuments: [DOCUMENT_TYPES.PASSPORT]
            };

            const createdTemplate = {
                id: '1',
                ...templateData,
                createdAt: mockDate
            };

            mockPrisma.requestTemplate.create.mockResolvedValue(createdTemplate);

            // WHEN
            const result = await createTemplate(templateData);

            // THEN
            expect(result).toEqual(createdTemplate);
            expect(mockPrisma.requestTemplate.create).toHaveBeenCalledWith({
                data: templateData
            });
        });

        it('devrait gérer les erreurs lors de la création', async () => {
            // GIVEN
            const templateData: CreateRequestTemplateParams = {
                title: 'New Template',
                requestedDocuments: [DOCUMENT_TYPES.PASSPORT]
            };

            mockPrisma.requestTemplate.create.mockRejectedValue(new Error('Insertion error'));

            // WHEN/THEN
            await expect(createTemplate(templateData)).rejects.toThrow('Failed to create template');
        });
    });

    describe('getTemplateById', () => {
        it('devrait récupérer un template par ID', async () => {
            // GIVEN
            mockPrisma.requestTemplate.findUnique.mockResolvedValue(mockPrismaTemplate);

            // WHEN
            const result = await getTemplateById('1');

            // THEN
            expect(result).toEqual(mockPrismaTemplate);
            expect(mockPrisma.requestTemplate.findUnique).toHaveBeenCalledWith({
                where: { id: '1' }
            });
        });

        it('devrait retourner null pour un ID inexistant', async () => {
            // GIVEN
            mockPrisma.requestTemplate.findUnique.mockResolvedValue(null);

            // WHEN
            const result = await getTemplateById('999');

            // THEN
            expect(result).toBeNull();
            expect(mockPrisma.requestTemplate.findUnique).toHaveBeenCalledWith({
                where: { id: '999' }
            });
        });

        it('devrait gérer les erreurs de recherche', async () => {
            // GIVEN
            mockPrisma.requestTemplate.findUnique.mockRejectedValue(new Error('Query error'));

            // WHEN/THEN
            await expect(getTemplateById('1')).rejects.toThrow('Failed to fetch template');
        });
    });

    describe('updateTemplate', () => {
        it('devrait mettre à jour un template existant', async () => {
            // GIVEN
            const updateData = {
                title: 'Updated Title',
                requestedDocuments: [DOCUMENT_TYPES.IDENTITY_CARD, DOCUMENT_TYPES.UTILITY_BILL]
            };

            const updatedTemplate = {
                ...mockPrismaTemplate,
                ...updateData
            };

            mockPrisma.requestTemplate.update.mockResolvedValue(updatedTemplate);

            // WHEN
            const result = await updateTemplate('1', updateData);

            // THEN
            expect(result).toEqual(updatedTemplate);
            expect(mockPrisma.requestTemplate.update).toHaveBeenCalledWith({
                where: { id: '1' },
                data: updateData
            });
        });

        it('devrait gérer les erreurs lors de la mise à jour', async () => {
            // GIVEN
            const updateData = { title: 'New Title' };
            mockPrisma.requestTemplate.update.mockRejectedValue(new Error('Update error'));

            // WHEN/THEN
            await expect(updateTemplate('1', updateData)).rejects.toThrow('Failed to update template');
        });

        it('devrait mettre à jour seulement les champs fournis', async () => {
            // GIVEN
            const updateData = { title: 'Title only update' };
            const updatedTemplate = {
                ...mockPrismaTemplate,
                title: 'Title only update'
            };

            mockPrisma.requestTemplate.update.mockResolvedValue(updatedTemplate);

            // WHEN
            const result = await updateTemplate('1', updateData);

            // THEN
            expect(result).toEqual(updatedTemplate);
            expect(mockPrisma.requestTemplate.update).toHaveBeenCalledWith({
                where: { id: '1' },
                data: updateData
            });
        });
    });

    describe('deleteTemplate', () => {
        it('devrait supprimer un template par ID', async () => {
            // GIVEN
            mockPrisma.requestTemplate.delete.mockResolvedValue(mockPrismaTemplate);

            // WHEN
            await deleteTemplate('1');

            // THEN
            expect(mockPrisma.requestTemplate.delete).toHaveBeenCalledWith({
                where: { id: '1' }
            });
        });

        it('devrait gérer les erreurs lors de la suppression', async () => {
            // GIVEN
            mockPrisma.requestTemplate.delete.mockRejectedValue(new Error('Delete error'));

            // WHEN/THEN
            await expect(deleteTemplate('1')).rejects.toThrow('Failed to delete template');
        });

        it('devrait propager les erreurs spécifiques de Prisma', async () => {
            // GIVEN - simuler erreur Prisma spécifique (enregistrement non trouvé)
            const prismaError = new Error('Record not found');
            Object.defineProperty(prismaError, 'code', { value: 'P2025' });
            mockPrisma.requestTemplate.delete.mockRejectedValue(prismaError);

            // WHEN/THEN
            await expect(deleteTemplate('999')).rejects.toThrow('Failed to delete template');
        });
    });
});