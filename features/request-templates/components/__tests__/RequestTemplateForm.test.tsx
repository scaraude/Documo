import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { RequestTemplateForm } from '../RequestTemplateForm';
import { DOCUMENT_TYPES } from '@/shared/constants';
import '@testing-library/jest-dom';

describe('RequestTemplateForm Component', () => {
    const mockAddTemplate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders form with all document type options', () => {
        render(<RequestTemplateForm addTemplate={mockAddTemplate} />);

        expect(screen.getByText('Créer un modèle de demande')).toBeInTheDocument();
        expect(screen.getByLabelText('Titre du modèle')).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: 'Titre du modèle' })).toHaveAttribute('id', 'template-title');

        // Check if all document types are rendered
        Object.values(DOCUMENT_TYPES).forEach(docType => {
            expect(screen.getByLabelText(docType)).toBeInTheDocument();
        });
    });

    test('handles form submission with selected documents', () => {
        render(<RequestTemplateForm addTemplate={mockAddTemplate} />);

        // Fill in the title
        const titleInput = screen.getByPlaceholderText('Ex: Dossier locatif');
        fireEvent.change(titleInput, { target: { value: 'Test Template' } });

        // Select some documents
        const identityCardCheckbox = screen.getByLabelText(DOCUMENT_TYPES.IDENTITY_CARD);
        const passportCheckbox = screen.getByLabelText(DOCUMENT_TYPES.PASSPORT);

        fireEvent.click(identityCardCheckbox);
        fireEvent.click(passportCheckbox);

        // Submit the form
        const submitButton = screen.getByText('Enregistrer le modèle');
        fireEvent.click(submitButton);

        expect(mockAddTemplate).toHaveBeenCalledWith(
            'Test Template',
            [DOCUMENT_TYPES.IDENTITY_CARD, DOCUMENT_TYPES.PASSPORT]
        );
    });

    test('resets form after submission', () => {
        render(<RequestTemplateForm addTemplate={mockAddTemplate} />);

        // Fill form
        const titleInput = screen.getByPlaceholderText('Ex: Dossier locatif');
        fireEvent.change(titleInput, { target: { value: 'Test Template' } });

        const checkbox = screen.getByLabelText(DOCUMENT_TYPES.IDENTITY_CARD);
        fireEvent.click(checkbox);

        // Submit form
        const submitButton = screen.getByText('Enregistrer le modèle');
        fireEvent.click(submitButton);

        // Check if form is reset
        expect(titleInput).toHaveValue('');
        expect(checkbox).not.toBeChecked();
    });

    test('requires title and at least one document', () => {
        render(<RequestTemplateForm addTemplate={mockAddTemplate} />);

        const submitButton = screen.getByText('Enregistrer le modèle');
        fireEvent.click(submitButton);

        expect(mockAddTemplate).not.toHaveBeenCalled();
    });

    test('handles document selection and deselection', () => {
        render(<RequestTemplateForm addTemplate={mockAddTemplate} />);

        const checkbox = screen.getByLabelText(DOCUMENT_TYPES.IDENTITY_CARD);

        // Select document
        fireEvent.click(checkbox);
        expect(checkbox).toBeChecked();

        // Deselect document
        fireEvent.click(checkbox);
        expect(checkbox).not.toBeChecked();
    });
});
