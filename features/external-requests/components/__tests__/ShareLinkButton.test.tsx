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
  const mockMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useExternalRequest as Mock).mockReturnValue({
      generateShareLink: {
        mutate: mockMutate,
        isLoading: false,
      },
    });
  });

  it('should generate and copy link on click', async () => {
    mockMutate.mockImplementation((_input, options) => {
      options?.onSuccess?.({ token: mockToken });
    });

    render(<ShareLinkButton requestId={mockRequestId} />);

    const button = screen.getByRole('button');
    await act(async () => {
      fireEvent.click(button);
    });

    expect(mockMutate).toHaveBeenCalledWith(
      { requestId: mockRequestId },
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      }),
    );
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockShareLink);
    expect(toast.success).toHaveBeenCalledWith(
      'Lien copié dans le presse-papiers',
    );
  });

  it('should show loading state while generating link', async () => {
    let resolveSuccess: ((value: { token: string }) => void) | null = null;

    mockMutate.mockImplementation((_input, options) => {
      // Store the onSuccess callback to call it later
      new Promise<{ token: string }>((resolve) => {
        resolveSuccess = resolve;
      }).then((result) => options?.onSuccess?.(result));
    });

    render(<ShareLinkButton requestId={mockRequestId} />);

    const button = screen.getByRole('button');

    await act(async () => {
      fireEvent.click(button);
    });

    // Mutation should have been called
    expect(mockMutate).toHaveBeenCalled();

    // Resolve the promise
    await act(async () => {
      if (resolveSuccess) {
        resolveSuccess({ token: mockToken });
      }
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockShareLink);
  });

  it('should handle generation errors gracefully', async () => {
    mockMutate.mockImplementation((_input, options) => {
      options?.onError?.(new Error('Failed to generate link'));
    });

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
    mockMutate.mockImplementation(async (_input, options) => {
      // Call onSuccess which will trigger clipboard error
      await options?.onSuccess?.({ token: mockToken });
    });
    (navigator.clipboard.writeText as Mock).mockRejectedValue(
      new Error('Clipboard error'),
    );

    render(<ShareLinkButton requestId={mockRequestId} />);

    const button = screen.getByRole('button');
    await act(async () => {
      fireEvent.click(button);
      // Wait for async operations to complete
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith(
      'Erreur lors de la génération du lien de partage',
    );
  });
});
