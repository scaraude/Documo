import { render, screen } from '@testing-library/react';
import RequestTemplateCreator from '../page';
import {
    RequestTemplateForm,
    RequestTemplatesList,
    useRequestTemplates
} from '@/features/request-templates';

// Mock the features
jest.mock('@/features/request-templates', () => {
    const originalModule = jest.requireActual('@/features/request-templates');

    return {
        __esModule: true,
        ...originalModule,
        RequestTemplateForm: jest.fn(() => <div data-testid="template-form-mock" />),
        RequestTemplatesList: jest.fn(() => <div data-testid="templates-list-mock" />),
        useRequestTemplates: jest.fn()
    };
});

describe('RequestTemplateCreator Page', () => {
    const mockAddTemplate = jest.fn();
    const mockDeleteTemplate = jest.fn();
    const mockTemplates = [
        { id: '1', title: 'Template 1', requestedDocuments: ['IDENTITY_CARD'] },
        { id: '2', title: 'Template 2', requestedDocuments: ['PASSPORT'] }
    ];

    beforeEach(() => {
        jest.clearAllMocks();

        // Set up the mock return value for useRequestTemplates
        (useRequestTemplates as jest.Mock).mockReturnValue({
            templates: mockTemplates,
            addTemplate: mockAddTemplate,
            deleteTemplate: mockDeleteTemplate
        });
    });

    test('renders RequestTemplateForm with correct props', () => {
        render(<RequestTemplateCreator />);

        expect(screen.getByTestId('template-form-mock')).toBeInTheDocument();
        expect(RequestTemplateForm).toHaveBeenCalled();

        // Check the first argument of the first call
        const formProps = (RequestTemplateForm as jest.Mock).mock.calls[0][0];
        expect(formProps.addTemplate).toBe(mockAddTemplate);
    });

    test('renders RequestTemplatesList with correct props', () => {
        render(<RequestTemplateCreator />);

        expect(screen.getByTestId('templates-list-mock')).toBeInTheDocument();
        expect(RequestTemplatesList).toHaveBeenCalled();

        // Check the first argument of the first call
        const listProps = (RequestTemplatesList as jest.Mock).mock.calls[0][0];
        expect(listProps.templates).toBe(mockTemplates);
        expect(listProps.deleteTemplate).toBe(mockDeleteTemplate);
    });

    test('applies correct layout styles', () => {
        const { container } = render(<RequestTemplateCreator />);

        const mainContainer = container.firstChild;
        expect(mainContainer).toHaveClass('max-w-2xl');
        expect(mainContainer).toHaveClass('mx-auto');
        expect(mainContainer).toHaveClass('p-6');
    });
});