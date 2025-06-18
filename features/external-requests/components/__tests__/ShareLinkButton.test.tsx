import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ShareLinkButton } from '../ShareLinkButton';
import { toast } from 'sonner';
import { useExternalRequest } from '../../hooks/useExternalRequest';

// Mock dependencies
jest.mock('../../hooks/useExternalRequest');
jest.mock('sonner', () => ({
  ...jest.requireActual('sonner'),
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

describe('ShareLinkButton Component', () => {
  const mockRequestId = 'req-123';
  const mockToken = 'test-token';
  const mockShareLink = `${window.location.origin}/external/requests/${mockToken}`;
  const mockGenerateShareLink = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useExternalRequest as jest.Mock).mockReturnValue({
      mockGenerateShareLink: mockGenerateShareLink,
    });
  });

  it('should generate and copy link on click', async () => {
    mockGenerateShareLink.mockResolvedValue({ token: mockToken });

    render(<ShareLinkButton requestId={mockRequestId} />);

    const button = screen.getByRole('button');
    await act(async () => {
      fireEvent.click(button);
    });

    expect(mockGenerateShareLink).toHaveBeenCalledWith(mockRequestId);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockShareLink);
    expect(toast.success).toHaveBeenCalledWith(
      'Lien copié dans le presse-papiers'
    );
  });

  it('should show loading state while generating link', async () => {
    (mockGenerateShareLink as jest.Mock).mockImplementation(
      () =>
        new Promise(resolve =>
          setTimeout(() => resolve({ token: mockToken }), 100)
        )
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
    (mockGenerateShareLink as jest.Mock).mockRejectedValue(error);

    render(<ShareLinkButton requestId={mockRequestId} />);

    const button = screen.getByRole('button');
    await act(async () => {
      fireEvent.click(button);
    });

    expect(toast.error).toHaveBeenCalledWith(
      'Erreur lors de la génération du lien de partage'
    );
    expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
  });

  it('should handle clipboard errors gracefully', async () => {
    (mockGenerateShareLink as jest.Mock).mockResolvedValue({
      token: mockToken,
    });
    (navigator.clipboard.writeText as jest.Mock).mockRejectedValue(
      new Error('Clipboard error')
    );

    render(<ShareLinkButton requestId={mockRequestId} />);

    const button = screen.getByRole('button');
    await act(async () => {
      fireEvent.click(button);
    });

    expect(toast.error).toHaveBeenCalledWith(
      'Erreur lors de la génération du lien de partage'
    );
  });
});
