import { renderHook, act } from '@testing-library/react';
import { useDocumentUpload } from '../useDocumentUpload';
import { encryptFile, generateEncryptionKey } from '../../utils/encryption';
import { uploadDocument } from '../../api/documentsApi';
import { getRequestById } from '../../../requests/api/requestApi';
import { DOCUMENT_TYPES, DocumentStatus } from '@/shared/constants/documents/types';

// Add URL mock
const mockCreateObjectURL = jest.fn();
global.URL.createObjectURL = mockCreateObjectURL;

// Mock dependencies
jest.mock('uuid', () => ({
    v4: () => 'mock-uuid'
}));

jest.mock('../../utils/encryption', () => ({
    generateEncryptionKey: jest.fn(),
    encryptFile: jest.fn()
}));

jest.mock('../../api/documentsApi', () => ({
    uploadDocument: jest.fn()
}));

jest.mock('../../../requests/api/requestApi', () => ({
    getRequestById: jest.fn()
}));

describe('useDocumentUpload Hook', () => {
    const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    const mockEncryptedFile = new File(['encrypted'], 'test.txt', { type: 'text/plain' });
    const mockKey = {} as CryptoKey;

    beforeEach(() => {
        jest.clearAllMocks();
        // Add URL.createObjectURL mock reset
        mockCreateObjectURL.mockReturnValue('blob:mock-url');
        (generateEncryptionKey as jest.Mock).mockResolvedValue(mockKey);
        (encryptFile as jest.Mock).mockResolvedValue(mockEncryptedFile);
        (uploadDocument as jest.Mock).mockResolvedValue({
            id: 'mock-uuid',
            status: DocumentStatus.UPLOADED
        });
        (getRequestById as jest.Mock).mockResolvedValue({
            requestedDocuments: [DOCUMENT_TYPES.IDENTITY_CARD]
        });
        // Silence console.logs
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('getDocumentToFetchFromRequestId returns requested documents', async () => {
        const { result } = renderHook(() => useDocumentUpload());

        const documents = await result.current.getDocumentToFetchFromRequestId('request-1');

        expect(getRequestById).toHaveBeenCalledWith('request-1');
        expect(documents).toEqual([DOCUMENT_TYPES.IDENTITY_CARD]);
    });

    test('secureUploadDocument handles successful upload', async () => {
        const mockOnProgress = jest.fn();
        const { result } = renderHook(() => useDocumentUpload());

        let uploadedDoc;
        await act(async () => {
            uploadedDoc = await result.current.secureUploadDocument({
                requestId: 'request-1',
                file: mockFile,
                type: DOCUMENT_TYPES.IDENTITY_CARD,
                onProgress: mockOnProgress
            });
        });

        // Verify encryption and upload process
        expect(generateEncryptionKey).toHaveBeenCalled();
        expect(encryptFile).toHaveBeenCalledWith(mockFile, mockKey);
        expect(uploadDocument).toHaveBeenCalled();
        
        // Verify progress updates
        expect(mockOnProgress).toHaveBeenCalled();
        expect(result.current.uploadProgress).toEqual({
            documentId: 'mock-uuid',
            status: 'complete',
            progress: 100
        });

        // Verify returned document
        expect(uploadedDoc).toEqual({
            id: 'mock-uuid',
            status: DocumentStatus.UPLOADED
        });
    });

    test('secureUploadDocument handles upload failure', async () => {
        const error = new Error('Upload failed');
        (uploadDocument as jest.Mock).mockRejectedValueOnce(error);
        
        const { result } = renderHook(() => useDocumentUpload());

        await act(async () => {
            await expect(result.current.secureUploadDocument({
                requestId: 'request-1',
                file: mockFile,
                type: DOCUMENT_TYPES.IDENTITY_CARD
            })).rejects.toThrow('Upload failed');
        });

        expect(result.current.uploadProgress).toEqual({
            documentId: 'mock-uuid',
            status: 'error',
            error: 'Upload failed',
            progress: 0
        });
    });

    test('extracts correct metadata from file', async () => {
        const mockFileWithMetadata = new File(['test'], 'test.txt', {
            type: 'text/plain',
            lastModified: 1234567890
        });
        Object.defineProperty(mockFileWithMetadata, 'size', { value: 1024 });

        const { result } = renderHook(() => useDocumentUpload());

        await act(async () => {
            await result.current.secureUploadDocument({
                requestId: 'request-1',
                file: mockFileWithMetadata,
                type: DOCUMENT_TYPES.IDENTITY_CARD
            });
        });

        expect(uploadDocument).toHaveBeenCalledWith(expect.objectContaining({
            metadata: {
                name: 'test.txt',
                type: 'text/plain',
                size: 1024,
                lastModified: 1234567890
            }
        }));
    });
});
