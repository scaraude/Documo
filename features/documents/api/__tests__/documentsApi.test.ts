import { getDocuments, uploadDocument, updateDocumentStatus, deleteDocument, getDocument, getDocumentsByRequest } from '../documentsApi';
import * as storage from '@/features/storage/api';
import { AppDocument } from '@/shared/types';
import { DOCUMENT_TYPES, DocumentStatus } from '@/shared/constants/documents/types';

// Mock storage API
jest.mock('@/features/storage/api', () => ({
    getItem: jest.fn(),
    setItem: jest.fn()
}));

const mockStorage = storage as jest.Mocked<typeof storage>;

describe('Documents API', () => {
    const mockDocuments: AppDocument[] = [
        {
            id: '1',
            requestId: 'req-1',
            type: DOCUMENT_TYPES.IDENTITY_CARD,
            status: DocumentStatus.UPLOADED,
            metadata: {
                name: 'id-card.jpg',
                type: 'image/jpeg',
                size: 1024,
                lastModified: Date.now()
            },
            createdAt: new Date('2023-01-01'),
            updatedAt: new Date('2023-01-01')
        },
        {
            id: '2',
            requestId: 'req-2',
            type: DOCUMENT_TYPES.PASSPORT,
            status: DocumentStatus.PENDING,
            metadata: {
                name: 'passport.pdf',
                type: 'application/pdf',
                size: 2048,
                lastModified: Date.now()
            },
            createdAt: new Date('2023-01-02'),
            updatedAt: new Date('2023-01-02')
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        // Suppress console.error output during tests
        jest.spyOn(console, 'error').mockImplementation(() => { });
        // Default mock for getItem
        mockStorage.getItem.mockReturnValue(mockDocuments);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('getDocuments returns all documents from storage', async () => {
        const documents = await getDocuments();

        expect(documents).toEqual(mockDocuments);
        expect(mockStorage.getItem).toHaveBeenCalledWith('documents');
    });

    test('getDocuments returns empty array when no documents exist', async () => {
        mockStorage.getItem.mockReturnValueOnce(null);

        const documents = await getDocuments();

        expect(documents).toEqual([]);
    });

    test('getDocuments handles storage error', async () => {
        mockStorage.getItem.mockImplementationOnce(() => {
            throw new Error('Storage error');
        });

        await expect(getDocuments()).rejects.toThrow('Failed to fetch documents');
    });

    test('uploadDocument adds new document successfully', async () => {
        const newDocument: AppDocument = {
            id: '3',
            requestId: 'req-3',
            type: DOCUMENT_TYPES.BANK_STATEMENT,
            status: DocumentStatus.UPLOADING,
            metadata: {
                name: 'statement.pdf',
                type: 'application/pdf',
                size: 3072,
                lastModified: Date.now()
            },
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await uploadDocument(newDocument);

        expect(result).toEqual(newDocument);
        expect(mockStorage.setItem).toHaveBeenCalledWith(
            'documents',
            [...mockDocuments, newDocument]
        );
    });

    test('uploadDocument handles storage error', async () => {
        mockStorage.setItem.mockImplementationOnce(() => {
            throw new Error('Storage error');
        });

        await expect(uploadDocument({} as AppDocument)).rejects.toThrow('Failed to upload document');
    });

    test('updateDocumentStatus updates status successfully', async () => {
        const result = await updateDocumentStatus('1', DocumentStatus.VALID);

        expect(result.id).toBe('1');
        expect(result.status).toBe(DocumentStatus.VALID);
        expect(mockStorage.setItem).toHaveBeenCalled();
    });

    test('updateDocumentStatus throws error for non-existent document', async () => {
        await expect(updateDocumentStatus('non-existent', DocumentStatus.VALID))
            .rejects.toThrow('Document with ID non-existent not found');
    });

    test('deleteDocument removes document successfully', async () => {
        await deleteDocument('1');

        expect(mockStorage.setItem).toHaveBeenCalledWith(
            'documents',
            mockDocuments.filter(doc => doc.id !== '1')
        );
    });

    test('deleteDocument throws error for non-existent document', async () => {
        await expect(deleteDocument('non-existent'))
            .rejects.toThrow('Document with ID non-existent not found');
    });

    test('getDocument returns document by ID', async () => {
        const document = await getDocument('1');

        expect(document).toEqual(mockDocuments[0]);
    });

    test('getDocument returns null for non-existent document', async () => {
        const document = await getDocument('non-existent');

        expect(document).toBeNull();
    });

    test('getDocumentsByRequest returns documents for request ID', async () => {
        const documents = await getDocumentsByRequest('req-1');

        expect(documents).toEqual([mockDocuments[0]]);
    });

    test('getDocumentsByRequest returns empty array when no documents match', async () => {
        const documents = await getDocumentsByRequest('non-existent');

        expect(documents).toEqual([]);
    });
});
