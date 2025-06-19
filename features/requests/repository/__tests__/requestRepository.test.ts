// features/requests/repository/__tests__/requestRepository.test.ts
import {
  getRequests,
  createRequest,
  deleteRequest,
  getRequestById,
} from '../requestRepository';
import { APP_DOCUMENT_TYPES } from '@/shared/constants';
import { CreateRequestParams } from '../../types';
import prisma from '@/lib/prisma';

// Mock Prisma
jest.mock('@/lib/prisma', () => {
  return {
    __esModule: true,
    default: {
      documentRequest: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    },
  };
});

// Typer le mock pour résoudre l'erreur TypeScript
const mockPrisma = prisma as jest.Mocked<typeof prisma> & {
  documentRequest: {
    findMany: jest.Mock;
    findUnique: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };
};

describe('Request Repository', () => {
  // Configuration commune
  const mockDate = new Date('2023-01-01');
  const expiryDate = new Date('2023-01-08'); // 7 jours plus tard

  const mockPrismaRequest = {
    id: '1',
    email: 'test@example.com',
    requestedDocuments: [
      {
        id: APP_DOCUMENT_TYPES.IDENTITY_PROOF,
        label: "Pièce d'identité",
        description: "Document officiel d'identité",
        acceptedFormats: ['pdf', 'jpg', 'png'],
        maxSizeMB: 5,
        createdAt: mockDate,
      },
    ],
    createdAt: mockDate,
    expiresAt: expiryDate,
    updatedAt: mockDate,
    acceptedAt: null,
    rejectedAt: null,
    completedAt: null,
    firstDocumentUploadedAt: null,
    folderId: 'test-folder-id',
    folder: {
      id: 'test-folder-id',
      name: 'Test Folder',
    },
  };

  const mockRequests = [mockPrismaRequest];

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('getRequests', () => {
    it('devrait récupérer toutes les demandes de la base de données', async () => {
      // GIVEN
      mockPrisma.documentRequest.findMany.mockResolvedValue(mockRequests);

      // WHEN
      const result = await getRequests();

      // THEN
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
      expect(result[0].email).toBe('test@example.com');
      expect(mockPrisma.documentRequest.findMany).toHaveBeenCalledTimes(1);
    });

    it("devrait retourner un tableau vide quand aucune demande n'existe", async () => {
      // GIVEN
      mockPrisma.documentRequest.findMany.mockResolvedValue([]);

      // WHEN
      const result = await getRequests();

      // THEN
      expect(result).toEqual([]);
      expect(mockPrisma.documentRequest.findMany).toHaveBeenCalledTimes(1);
    });

    it('devrait gérer les erreurs de base de données', async () => {
      // GIVEN
      const dbError = new Error('Erreur de connexion à la DB');
      mockPrisma.documentRequest.findMany.mockRejectedValue(dbError);

      // WHEN/THEN
      await expect(getRequests()).rejects.toThrow('Failed to fetch requests');
    });
  });

  describe('createRequest', () => {
    it('devrait créer une nouvelle demande dans la base de données', async () => {
      // GIVEN
      const requestData: CreateRequestParams = {
        email: 'test@example.com',
        requestedDocuments: [APP_DOCUMENT_TYPES.IDENTITY_PROOF],
        folderId: 'test-folder-id',
      };

      mockPrisma.documentRequest.create.mockResolvedValue(mockPrismaRequest);

      // WHEN
      const result = await createRequest(requestData);

      // THEN
      expect(result.id).toBe('1');
      expect(result.email).toBe('test@example.com');
      expect(result.requestedDocuments).toEqual([
        APP_DOCUMENT_TYPES.IDENTITY_PROOF,
      ]);
      expect(mockPrisma.documentRequest.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: 'test@example.com',
          requestedDocuments: {
            connect: [{ id: APP_DOCUMENT_TYPES.IDENTITY_PROOF }],
          },
        }),
        include: {
          requestedDocuments: true,
        },
      });
    });

    it("devrait utiliser le nombre de jours d'expiration personnalisé", async () => {
      // GIVEN
      const requestData: CreateRequestParams = {
        email: 'test@example.com',
        requestedDocuments: [APP_DOCUMENT_TYPES.IDENTITY_PROOF],
        folderId: 'test-folder-id',
        expirationDays: 14,
      };

      const mockRequestWithCustomExpiry = {
        ...mockPrismaRequest,
        expiresAt: new Date('2023-01-15'), // 14 jours après mockDate
      };

      mockPrisma.documentRequest.create.mockResolvedValue(
        mockRequestWithCustomExpiry
      );

      // WHEN
      const result = await createRequest(requestData);

      // THEN
      expect(result.expiresAt).toEqual(new Date('2023-01-15'));
    });

    it('devrait gérer les erreurs lors de la création', async () => {
      // GIVEN
      const requestData: CreateRequestParams = {
        email: 'test@example.com',
        requestedDocuments: [APP_DOCUMENT_TYPES.IDENTITY_PROOF],
        folderId: 'test-folder-id',
      };

      mockPrisma.documentRequest.create.mockRejectedValue(
        new Error('Insertion error')
      );

      // WHEN/THEN
      await expect(createRequest(requestData)).rejects.toThrow(
        'Failed to create request'
      );
    });
  });

  describe('deleteRequest', () => {
    it('devrait supprimer une demande par ID', async () => {
      // GIVEN
      mockPrisma.documentRequest.delete.mockResolvedValue(mockPrismaRequest);

      // WHEN
      await deleteRequest('1');

      // THEN
      expect(mockPrisma.documentRequest.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('devrait gérer les erreurs lors de la suppression', async () => {
      // GIVEN
      mockPrisma.documentRequest.delete.mockRejectedValue(
        new Error('Delete error')
      );

      // WHEN/THEN
      await expect(deleteRequest('1')).rejects.toThrow(
        'Failed to delete request'
      );
    });
  });

  describe('getRequestById', () => {
    it('devrait récupérer une demande par ID', async () => {
      // GIVEN
      mockPrisma.documentRequest.findUnique.mockResolvedValue(
        mockPrismaRequest
      );

      // WHEN
      const result = await getRequestById('1');

      // THEN
      expect(result).not.toBeNull();
      expect(result?.id).toBe('1');
      expect(mockPrisma.documentRequest.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          folder: true,
          requestedDocuments: true,
          documents: {
            where: { deletedAt: null },
            orderBy: { uploadedAt: 'desc' },
            include: { type: true },
          },
        },
      });
    });

    it('devrait retourner null pour un ID inexistant', async () => {
      // GIVEN
      mockPrisma.documentRequest.findUnique.mockResolvedValue(null);

      // WHEN
      const result = await getRequestById('999');

      // THEN
      expect(result).toBeNull();
    });

    it('devrait gérer les erreurs de recherche', async () => {
      // GIVEN
      mockPrisma.documentRequest.findUnique.mockRejectedValue(
        new Error('Query error')
      );

      // WHEN/THEN
      await expect(getRequestById('1')).rejects.toThrow(
        'Failed to fetch request'
      );
    });
  });
});
