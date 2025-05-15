import { render, screen, act } from '@testing-library/react';
import { SecureDocumentUpload } from '../SecureDocumentUpload';
import { useDocumentUpload } from '../../hooks/useDocumentUpload';
import { DOCUMENT_TYPES } from '@/shared/constants/documents/types';

// Mock hooks and dependencies
jest.mock('../../hooks/useDocumentUpload');

// Create mock handler that will capture the onDrop callback
let dropHandler: (files: File[]) => void;

jest.mock('react-dropzone', () => ({
    useDropzone: ({ onDrop }: { onDrop: (files: File[]) => void }) => {
        // Store the handler for use in tests
        dropHandler = onDrop;
        return {
            getRootProps: () => ({
                onClick: jest.fn(),
                'data-testid': 'dropzone'
            }),
            getInputProps: () => ({}),
            isDragActive: false
        };
    }
}));

const mockUseDocumentUpload = useDocumentUpload as jest.MockedFunction<typeof useDocumentUpload>;

describe('SecureDocumentUpload', () => {
    const defaultProps = {
        requestId: 'test-request',
        documentType: DOCUMENT_TYPES.IDENTITY_CARD,
        onUploadComplete: jest.fn(),
        onUploadError: jest.fn()
    };

    const mockSecureUploadDocument = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseDocumentUpload.mockReturnValue({
            secureUploadDocument: mockSecureUploadDocument,
            uploadProgress: null,
            encryptFile: jest.fn(),
            getDocumentToFetchFromRequestId: jest.fn()
        });
    });

    test('renders upload area when no upload is in progress', () => {
        render(<SecureDocumentUpload {...defaultProps} />);

        expect(screen.getByText(/Drag and drop a file here/i)).toBeInTheDocument();
        expect(screen.getByText(/Supported formats/i)).toBeInTheDocument();
    });

    test('displays progress bar during upload', () => {
        mockUseDocumentUpload.mockReturnValue({
            secureUploadDocument: mockSecureUploadDocument,
            uploadProgress: {
                documentId: '123',
                status: 'uploading',
                progress: 50
            },
            encryptFile: jest.fn(),
            getDocumentToFetchFromRequestId: jest.fn()
        });

        render(<SecureDocumentUpload {...defaultProps} />);

        expect(screen.getByText('Uploading...')).toBeInTheDocument();
        const progressBar = screen.getByRole('progressbar');
        expect(progressBar).toHaveAttribute('aria-valuenow', '50');
    });

    test('handles upload completion', async () => {
        mockSecureUploadDocument.mockResolvedValue({ id: 'doc-123' });

        render(<SecureDocumentUpload {...defaultProps} />);

        await act(async () => {
            const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
            await dropHandler([file]);
        });

        expect(mockSecureUploadDocument).toHaveBeenCalledWith({
            requestId: 'test-request',
            file: expect.any(File),
            type: DOCUMENT_TYPES.IDENTITY_CARD,
            onProgress: expect.any(Function)
        });
        expect(defaultProps.onUploadComplete).toHaveBeenCalledWith('doc-123');
    });

    test('handles upload error', async () => {
        const error = new Error('Upload failed');
        mockSecureUploadDocument.mockRejectedValue(error);

        render(<SecureDocumentUpload {...defaultProps} />);

        await act(async () => {
            const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
            await dropHandler([file]);
        });

        expect(mockSecureUploadDocument).toHaveBeenCalled();
        expect(defaultProps.onUploadError).toHaveBeenCalledWith(error);
    });
});
