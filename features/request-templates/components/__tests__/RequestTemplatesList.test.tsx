import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { RequestTemplatesList } from '../RequestTemplatesList';
import { APP_DOCUMENT_TYPES } from '@/shared/constants';
import { RequestTemplate } from '../../types';
import '@testing-library/jest-dom';
import { APP_DOCUMENT_TYPE_TO_LABEL_MAP } from '@/shared/mapper';

describe('RequestTemplatesList Component', () => {
    const mockTemplates: RequestTemplate[] = [
        {
            id: '1',
            title: 'Identity Documents',
            requestedDocuments: [APP_DOCUMENT_TYPES.IDENTITY_CARD],
            createdAt: new Date('2023-01-01')
        },
        {
            id: '2',
            title: 'Financial Documents',
            requestedDocuments: [APP_DOCUMENT_TYPES.BANK_STATEMENT, APP_DOCUMENT_TYPES.IDENTITY_CARD],
            createdAt: new Date('2023-01-02')
        }
    ];

    const mockDeleteTemplate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders empty state when no templates exist', () => {
        render(<RequestTemplatesList templates={[]} deleteTemplate={mockDeleteTemplate} />);

        expect(screen.getByText('Modèles enregistrés')).toBeInTheDocument();
        expect(screen.getByText('Aucun modèle enregistré')).toBeInTheDocument();
    });

    test('renders templates list correctly', () => {
        render(<RequestTemplatesList templates={mockTemplates} deleteTemplate={mockDeleteTemplate} />);

        expect(screen.getByText('Identity Documents')).toBeInTheDocument();
        expect(screen.getByText('Financial Documents')).toBeInTheDocument();
        expect(screen.getAllByText(APP_DOCUMENT_TYPE_TO_LABEL_MAP[APP_DOCUMENT_TYPES.IDENTITY_CARD])).toHaveLength(2);
        expect(screen.getByText(APP_DOCUMENT_TYPE_TO_LABEL_MAP[APP_DOCUMENT_TYPES.BANK_STATEMENT])).toBeInTheDocument();
        // expect(screen.getByText(APP_DOCUMENT_TYPES.PASSPORT)).toBeInTheDocument();
    });

    test('handles delete template', () => {
        render(<RequestTemplatesList templates={mockTemplates} deleteTemplate={mockDeleteTemplate} />);

        const deleteButtons = screen.getAllByText('Supprimer');
        fireEvent.click(deleteButtons[0]);

        expect(mockDeleteTemplate).toHaveBeenCalledWith('1');
    });

    test('applies correct styling to template items', () => {
        render(<RequestTemplatesList templates={mockTemplates} deleteTemplate={mockDeleteTemplate} />);

        const templateItems = screen.getAllByRole('listitem');
        expect(templateItems[0]).toHaveClass('border', 'p-4', 'rounded');

        const deleteButtons = screen.getAllByText('Supprimer');
        expect(deleteButtons[0]).toHaveClass('text-red-600', 'hover:text-red-800');
    });
});
