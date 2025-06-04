import { render, screen, fireEvent, act } from '@testing-library/react';
import { ShareLinkButton } from '../ShareLinkButton';
import { generateShareLink } from '@/features/requests/api/externalRequestsApi';
import { toast } from 'sonner';

// Mock dependencies
jest.mock('@/features/requests/api/externalRequestsApi');
jest.mock('sonner', () => ({
    ...jest.requireActual('sonner'),
    toast: {
        success: jest.fn(),
        error: jest.fn()
    }
}));

// Mock clipboard
Object.assign(navigator, {
    clipboard: {
        writeText: jest.fn()
    }
});

describe('ShareLinkButton Component', () => {
    const mockRequestId = 'req-123';
    const mockToken = 'test-token';
    const mockShareLink = `${window.location.origin}/external/requests/${mockToken}`;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should generate and copy link on click', async () => {
        (generateShareLink as jest.Mock).mockResolvedValue({ token: mockToken });

        render(<ShareLinkButton requestId={mockRequestId} />);

        const button = screen.getByRole('button');
        await act(async () => {
            fireEvent.click(button);
        });

        expect(generateShareLink).toHaveBeenCalledWith(mockRequestId);
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockShareLink);
        expect(toast.success).toHaveBeenCalledWith('Lien copié dans le presse-papiers');
    });

    it('should show loading state while generating link', async () => {
        (generateShareLink as jest.Mock).mockImplementation(
            () => new Promise(resolve => setTimeout(() => resolve({ token: mockToken }), 100))
        );

        render(<ShareLinkButton requestId={mockRequestId} />);

        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(button).toHaveAttribute('disabled');
        expect(screen.getByText(/Génération.../i)).toBeInTheDocument();

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 150));
        });

        expect(button).not.toHaveAttribute('disabled');
    });

    it('should handle generation errors gracefully', async () => {
        const error = new Error('Failed to generate link');
        (generateShareLink as jest.Mock).mockRejectedValue(error);

        render(<ShareLinkButton requestId={mockRequestId} />);

        const button = screen.getByRole('button');
        await act(async () => {
            fireEvent.click(button);
        });

        expect(toast.error).toHaveBeenCalledWith('Erreur lors de la génération du lien de partage');
        expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
    });

    it('should handle clipboard errors gracefully', async () => {
        (generateShareLink as jest.Mock).mockResolvedValue({ token: mockToken });
        (navigator.clipboard.writeText as jest.Mock).mockRejectedValue(new Error('Clipboard error'));

        render(<ShareLinkButton requestId={mockRequestId} />);

        const button = screen.getByRole('button');
        await act(async () => {
            fireEvent.click(button);
        });

        expect(toast.error).toHaveBeenCalledWith('Erreur lors de la génération du lien de partage');
    });
});
