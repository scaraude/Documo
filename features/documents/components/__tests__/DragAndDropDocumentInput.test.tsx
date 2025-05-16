import { render, screen } from '@testing-library/react';
import { DragAndDropDocumentInput } from '../DragAndDropDocumentInput';
import { APP_DOCUMENT_TYPES } from '@/shared/constants/documents/types';

// Mock SecureDocumentUpload component
jest.mock('../SecureDocumentUpload', () => ({
    SecureDocumentUpload: () => <div data-testid="secure-upload" />
}));

describe('DragAndDropDocumentInput', () => {
    const defaultProps = {
        documentType: APP_DOCUMENT_TYPES.IDENTITY_CARD,
        requestId: 'request-123',
        onUploadComplete: jest.fn(),
        onUploadError: jest.fn()
    };

    test('renders correct title for identity card', () => {
        render(<DragAndDropDocumentInput {...defaultProps} />);

        expect(screen.getByText("Carte d'identité")).toBeInTheDocument();
        expect(screen.getByTestId('secure-upload')).toBeInTheDocument();
    });

    test('renders correct title for passport', () => {
        render(
            <DragAndDropDocumentInput
                {...defaultProps}
                documentType={APP_DOCUMENT_TYPES.PASSPORT}
            />
        );

        expect(screen.getByText('Passeport')).toBeInTheDocument();
    });

    test('renders correct title for bank statement', () => {
        render(
            <DragAndDropDocumentInput
                {...defaultProps}
                documentType={APP_DOCUMENT_TYPES.BANK_STATEMENT}
            />
        );

        expect(screen.getByText(/RIB/)).toBeInTheDocument();
    });

    test('returns null for invalid document type', () => {
        const { container } = render(
            <DragAndDropDocumentInput
                {...defaultProps}
                documentType={'INVALID_TYPE' as APP_DOCUMENT_TYPES}
            />
        );

        expect(container.firstChild).toBeNull();
    });

    test('passes correct props to SecureDocumentUpload', () => {
        render(<DragAndDropDocumentInput {...defaultProps} />);

        const secureUpload = screen.getByTestId('secure-upload');
        expect(secureUpload).toBeInTheDocument();
    });
});
