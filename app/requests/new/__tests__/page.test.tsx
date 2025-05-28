import { render, screen } from '@testing-library/react';
import { useRequestTemplates } from '@/features/request-templates';
import NewRequest from '../page';

// Mock the imported hooks and components
jest.mock('@/features/request-templates', () => ({
    useRequestTemplates: jest.fn()
}));

jest.mock('@/features/requests/components', () => ({
    FormCreateRequest: jest.fn(() => <div data-testid="form-create-request-mock" />)
}));

describe('NewRequest Page', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders loading state when templates are not loaded', () => {
        // Mock the hook to return isLoaded as false
        (useRequestTemplates as jest.Mock).mockReturnValue({
            isLoaded: false
        });

        render(<NewRequest />);

        expect(screen.getByText('Chargement...')).toBeInTheDocument();
        expect(screen.queryByTestId('form-create-request-mock')).not.toBeInTheDocument();
    });

    test('renders FormCreateRequest when templates are loaded', () => {
        // Mock the hook to return isLoaded as true
        (useRequestTemplates as jest.Mock).mockReturnValue({
            isLoaded: true
        });

        render(<NewRequest />);

        expect(screen.queryByText('Chargement...')).not.toBeInTheDocument();
        expect(screen.getByTestId('form-create-request-mock')).toBeInTheDocument();
    });

    test('applies correct layout styles', () => {
        (useRequestTemplates as jest.Mock).mockReturnValue({
            isLoaded: true
        });

        const { container } = render(<NewRequest />);

        // Test the container has the right classes
        const mainContainer = container.firstChild;
        expect(mainContainer).toHaveClass('min-h-screen');
        expect(mainContainer).toHaveClass('flex');
        expect(mainContainer).toHaveClass('flex-col');
        expect(mainContainer).toHaveClass('items-center');
        expect(mainContainer).toHaveClass('bg-gray-50');
    });
});