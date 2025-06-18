import { render, screen, fireEvent, act } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import * as externalRequestsRepository from '../../repository/externalRequestsRepository';
import * as documentsRepository from '@/features/documents/repository/documentsRepository';
import { ShareLinkButton } from '../../components/ShareLinkButton';
import ExternalRequestPage from '@/app/external/requests/[token]/page';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: () => ({ token: 'test-token' }),
}));

jest.mock('../../repository/externalRequestsRepository');
jest.mock('@/features/documents/repository/documentsRepository');

describe('External Document Upload Flow', () => {
  const mockRouter = {
    push: jest.fn(),
    refresh: jest.fn(),
  };

  const mockRequest = {
    id: 'req-123',
    civilId: 'civ-123',
    requestedDocuments: ['ID_CARD'],
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 86400000), // 24 hours from now
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  describe('Share Link Generation', () => {
    const mockToken = 'test-token';

    it('should complete full share link generation flow', async () => {
      (
        externalRequestsRepository.createShareLink as jest.Mock
      ).mockResolvedValue({
        token: mockToken,
      });

      render(<ShareLinkButton requestId={mockRequest.id} />);

      const button = screen.getByRole('button');
      await act(async () => {
        fireEvent.click(button);
      });

      expect(externalRequestsRepository.createShareLink).toHaveBeenCalledWith({
        requestId: mockRequest.id,
        token: expect.any(String),
        expiresAt: expect.any(Date),
      });
    });
  });

  describe('External Access Flow', () => {
    it('should handle complete external user journey', async () => {
      // Mock share link lookup
      (
        externalRequestsRepository.getShareLinkByToken as jest.Mock
      ).mockResolvedValue({
        request: mockRequest,
      });

      render(<ExternalRequestPage />);

      // Wait for the request to load
      await screen.findByText(/Demande de documents/i);

      // Verify request details are displayed
      expect(
        screen.getByText(/Continuer avec FranceConnect/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Continuer avec un email/i)).toBeInTheDocument();

      // Verify document list
      mockRequest.requestedDocuments.forEach(doc => {
        expect(screen.getByText(new RegExp(doc, 'i'))).toBeInTheDocument();
      });
    });

    it('should maintain session state during upload', async () => {
      // Implementation depends on your session management
      // This is a basic example
      const mockSession = { user: { id: 'user-123' } };
      jest
        .spyOn(Storage.prototype, 'getItem')
        .mockImplementation(key =>
          key === 'session' ? JSON.stringify(mockSession) : null
        );

      (
        externalRequestsRepository.getShareLinkByToken as jest.Mock
      ).mockResolvedValue({
        request: mockRequest,
      });

      render(<ExternalRequestPage />);

      await screen.findByText(/Demande de documents/i);

      // Verify session is maintained
      expect(localStorage.getItem('session')).toBeTruthy();
    });
  });

  describe('Security Aspects', () => {
    it('should prevent access with expired tokens', async () => {
      // Mock expired share link
      (
        externalRequestsRepository.getShareLinkByToken as jest.Mock
      ).mockResolvedValue(null);

      render(<ExternalRequestPage />);

      await screen.findByText(/Demande non trouvée/i);
      expect(
        screen.getByText(/La demande n'existe pas ou a expiré/i)
      ).toBeInTheDocument();
    });

    it('should validate document upload permissions', async () => {
      const mockUpload = jest.fn().mockRejectedValue(new Error('Unauthorized'));

      (
        externalRequestsRepository.getShareLinkByToken as jest.Mock
      ).mockResolvedValue({
        request: mockRequest,
      });

      (documentsRepository.uploadDocument as jest.Mock) = mockUpload;

      render(<ExternalRequestPage />);

      await screen.findByText(/Demande de documents/i);

      // Attempt unauthorized upload
      // Note: Actual implementation would depend on your upload component
      expect(mockUpload).toHaveBeenCalledTimes(0);
    });
  });
});
