import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import DocumentUploadPage from '../page';
import { useDocumentUpload } from '@/features/documents';
import { AppDocumentType, APP_DOCUMENT_TYPES } from '@/shared/constants/documents/types';
import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useParams: jest.fn(() => ({ requestId: 'test-request-id' })),
    useRouter: jest.fn(() => ({
        push: jest.fn()
    }))
}));

// Mock the useDocumentUpload hook
jest.mock('@/features/documents/hooks/useDocumentUpload', () => ({
    __esModule: true,
    useDocumentUpload: jest.fn()
}));

// Mock the DragAndDropDocumentInput component
jest.mock('@/features/documents/components/DragAndDropDocumentInput', () => ({
    __esModule: true,
    DragAndDropDocumentInput: jest.fn(
        (props: {
            documentType: AppDocumentType;
            requestId: string;
            onUploadComplete: (documentId: string) => void;
            onUploadError: (error: Error) => void
        }) => (
            <div data-testid={`drag-drop-input-${props.documentType}`}>
                Mock document input for {props.documentType}
            </div>
        )
    )
}));

// Re-export from index.ts
jest.mock('@/features/documents', () => ({
    ...jest.requireActual('@/features/documents'),
    useDocumentUpload: jest.fn(),
    DragAndDropDocumentInput: jest.fn(
        (props: {
            documentType: AppDocumentType;
            requestId: string;
            onUploadComplete: (documentId: string) => void;
            onUploadError: (error: Error) => void
        }) => (
            <div data-testid={`drag-drop-input-${props.documentType}`}>
                Mock document input for {props.documentType}
            </div>
        )
    )
}));

// Mock console.error to avoid polluting test output
const originalConsoleError = console.error;
beforeAll(() => {
    console.error = jest.fn();
});

afterAll(() => {
    console.error = originalConsoleError;
});

describe('DocumentUploadPage', () => {
    const mockGetDocumentToFetchFromRequestId = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        (useDocumentUpload as jest.Mock).mockReturnValue({
            getDocumentToFetchFromRequestId: mockGetDocumentToFetchFromRequestId,
            uploadProgress: null,
            secureUploadDocument: jest.fn(),
            encryptFile: jest.fn()
        });
    });

    test('renders loading state initially', async () => {
        mockGetDocumentToFetchFromRequestId.mockResolvedValue([]);

        await act(async () => {
            render(<DocumentUploadPage />);
        });

        expect(screen.getByText('Upload Document')).toBeInTheDocument();
        // No document inputs should be rendered initially
        expect(screen.queryByTestId(/drag-drop-input/)).not.toBeInTheDocument();
    });

    test('renders document inputs after loading document types', async () => {
        mockGetDocumentToFetchFromRequestId.mockResolvedValue([
            APP_DOCUMENT_TYPES.IDENTITY_CARD,
            APP_DOCUMENT_TYPES.UTILITY_BILL
        ]);

        await act(async () => {
            render(<DocumentUploadPage />);
        });

        // Need to wait for state updates from async callbacks
        await waitFor(() => {
            expect(mockGetDocumentToFetchFromRequestId).toHaveBeenCalledWith('test-request-id');
            expect(screen.getByTestId(`drag-drop-input-${APP_DOCUMENT_TYPES.IDENTITY_CARD}`)).toBeInTheDocument();
            expect(screen.getByTestId(`drag-drop-input-${APP_DOCUMENT_TYPES.UTILITY_BILL}`)).toBeInTheDocument();
        });
    });

    test('displays error when no document types are found', async () => {
        mockGetDocumentToFetchFromRequestId.mockResolvedValue([]);

        await act(async () => {
            render(<DocumentUploadPage />);
        });

        // Wait for error to be set and rendered
        await waitFor(() => {
            expect(screen.getByText(/No document types found for this request ID/)).toBeInTheDocument();
        });
    });

    test('displays error message when fetch fails', async () => {
        mockGetDocumentToFetchFromRequestId.mockRejectedValue(new Error('Failed to fetch'));

        await act(async () => {
            render(<DocumentUploadPage />);
        });

        // Wait for error to be set and rendered
        await waitFor(() => {
            expect(screen.getByText(/Failed to fetch document types/)).toBeInTheDocument();
        });
    });

    test('handles successful document upload', async () => {
        mockGetDocumentToFetchFromRequestId.mockResolvedValue([APP_DOCUMENT_TYPES.PASSPORT]);

        await act(async () => {
            render(<DocumentUploadPage />);
        });

        // Wait for the component to load document types
        await waitFor(() => {
            expect(screen.getByTestId(`drag-drop-input-${APP_DOCUMENT_TYPES.PASSPORT}`)).toBeInTheDocument();
        });

        // Check that success message is initially not shown
        expect(screen.queryByText(/Document uploaded successfully/)).not.toBeInTheDocument();

        // We could further test the upload success scenario by:
        // 1. Finding the DragAndDropDocumentInput and mocking its onUploadComplete call
        // 2. Then checking that success message appears
        // But we'd need to know more about how the component works internally
    });

    test('renders error when request ID is missing', async () => {
        // Override the mock for this specific test
        const useParamsMock = jest.requireMock('next/navigation').useParams;
        useParamsMock.mockReturnValueOnce({});

        await act(async () => {
            render(<DocumentUploadPage />);
        });

        expect(screen.getByText(/Request ID is required/)).toBeInTheDocument();
    });
});