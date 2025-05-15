import { validateDocument } from '../validation';
import { generateFileHash } from '../encryption';
import { ALLOWED_FILE_TYPES, DOCUMENT_TYPES, DocumentStatus } from '@/shared/constants/documents/types';
import { Document } from '../../types';

// Mock encryption utility
jest.mock('../encryption', () => ({
    generateFileHash: jest.fn()
}));

const mockGenerateFileHash = generateFileHash as jest.MockedFunction<typeof generateFileHash>;

describe('validateDocument', () => {
    const mockDocument: Document = {
        id: '1',
        requestId: 'req-1',
        status: DocumentStatus.PENDING, // Replace with a valid status from your Document type if it's an enum
        createdAt: new Date(),
        updatedAt: new Date(),
        type: DOCUMENT_TYPES.IDENTITY_CARD,
        metadata: {
            hash: 'existing-hash-123',
            name: 'test.jpg',
            type: ALLOWED_FILE_TYPES.JPEG,
            size: 1024 * 1024, // 1MB
            lastModified: Date.now()
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockGenerateFileHash.mockResolvedValue('generated-hash-123');
    });

    test('validates file type successfully', async () => {
        const validFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
        mockGenerateFileHash.mockResolvedValue('existing-hash-123');

        const result = await validateDocument(mockDocument, validFile);

        expect(result.isValid).toBe(true);
        expect(result.errors).toEqual([]);
    });

    test('rejects invalid file type', async () => {
        const invalidFile = new File([''], 'test.txt', { type: 'text/plain' });
        mockGenerateFileHash.mockResolvedValue('existing-hash-123');

        const result = await validateDocument(mockDocument, invalidFile);

        expect(result.isValid).toBe(false);
        expect(result.errors[0]).toMatch(/Invalid file type/);
    });

    test('validates file size successfully', async () => {
        const validFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
        Object.defineProperty(validFile, 'size', { value: 1024 * 1024 }); // 1MB
        mockGenerateFileHash.mockResolvedValue('existing-hash-123');

        const result = await validateDocument(mockDocument, validFile);

        expect(result.isValid).toBe(true);
        expect(result.errors).toEqual([]);
    });

    test('rejects file that exceeds size limit', async () => {
        const largeFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
        Object.defineProperty(largeFile, 'size', { value: 1024 * 1024 * 100 }); // 100MB
        mockGenerateFileHash.mockResolvedValue('existing-hash-123');

        const result = await validateDocument(mockDocument, largeFile);

        expect(result.isValid).toBe(false);
        expect(result.errors[0]).toMatch(/File too large/);
    });

    test('validates file hash successfully', async () => {
        const validFile = new File([''], 'test.jpg', {
            type: ALLOWED_FILE_TYPES.JPEG
        });
        mockGenerateFileHash.mockResolvedValue('existing-hash-123');

        const result = await validateDocument(mockDocument, validFile);

        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
    });

    test('rejects file with mismatched hash', async () => {
        const file = new File([''], 'test.jpg', {
            type: ALLOWED_FILE_TYPES.JPEG
        });
        mockGenerateFileHash.mockResolvedValue('different-hash-456');

        const result = await validateDocument(mockDocument, file);

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('File integrity check failed');
    });

    test('returns multiple validation errors when applicable', async () => {
        const invalidFile = new File([''], 'test.txt', { type: 'text/plain' });
        Object.defineProperty(invalidFile, 'size', { value: 1024 * 1024 * 100 }); // 100MB
        mockGenerateFileHash.mockResolvedValue('different-hash-456');

        const result = await validateDocument(mockDocument, invalidFile);

        expect(result.isValid).toBe(false);
        expect(result.errors).toHaveLength(3);
        expect(result.errors).toEqual(expect.arrayContaining([
            expect.stringMatching(/Invalid file type/),
            expect.stringMatching(/File too large/),
            'File integrity check failed'
        ]));
    });
});
