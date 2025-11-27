import { act, fireEvent, render, screen } from '@testing-library/react';
import { toast } from 'sonner';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';
import { useExternalRequest } from '../../hooks/useExternalRequest';
import { ShareLinkButton } from '../ShareLinkButton';

// Mock dependencies
vi.mock('../../hooks/useExternalRequest');
vi.mock('sonner', async () => ({
  ...(await vi.importActual('sonner')),
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
});

describe('ShareLinkButton Component', () => {
  const mockRequestId = 'req-123';
  const mockToken = 'test-token';
  const mockShareLink = `${window.location.origin}/external/requests/${mockToken}`;
  const mockGenerateShareLink = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useExternalRequest as Mock).mockReturnValue({
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
      'Lien copié dans le presse-papiers',
    );
  });

  it('should show loading state while generating link', async () => {
    (mockGenerateShareLink as Mock).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ token: mockToken }), 100),
        ),
    );

    render(<ShareLinkButton requestId={mockRequestId} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(button).toHaveAttribute('disabled');
    expect(screen.getByText(/Génération.../i)).toBeInTheDocument();

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 150));
    });

    expect(button).not.toHaveAttribute('disabled');
  });

  it('should handle generation errors gracefully', async () => {
    const error = new Error('Failed to generate link');
    (mockGenerateShareLink as Mock).mockRejectedValue(error);

    render(<ShareLinkButton requestId={mockRequestId} />);

    const button = screen.getByRole('button');
    await act(async () => {
      fireEvent.click(button);
    });

    expect(toast.error).toHaveBeenCalledWith(
      'Erreur lors de la génération du lien de partage',
    );
    expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
  });

  it('should handle clipboard errors gracefully', async () => {
    (mockGenerateShareLink as Mock).mockResolvedValue({
      token: mockToken,
    });
    (navigator.clipboard.writeText as Mock).mockRejectedValue(
      new Error('Clipboard error'),
    );

    render(<ShareLinkButton requestId={mockRequestId} />);

    const button = screen.getByRole('button');
    await act(async () => {
      fireEvent.click(button);
    });

    expect(toast.error).toHaveBeenCalledWith(
      'Erreur lors de la génération du lien de partage',
    );
  });
});
