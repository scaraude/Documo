import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RequestsList } from '../RequestsList';
import '@testing-library/jest-dom';
import { useRequests } from '../../hooks/useRequests';
import { checkNotificationResponse } from '@/features/notifications/api/notificationsApi';
import { APP_DOCUMENT_TYPES } from '@/shared/constants';
import { DocumentRequest } from '@/shared/types';
import { APP_DOCUMENT_TYPE_TO_LABEL_MAP } from '@/shared/mapper';

// Mock dependencies
jest.mock('../../hooks/useRequests');
jest.mock('@/features/notifications/api/notificationsApi');

// Mock window.confirm
window.confirm = jest.fn();

describe('RequestsList Component', () => {
  const mockRequests: DocumentRequest[] = [
    {
      id: '1',
      civilId: '123456',
      requestedDocuments: [APP_DOCUMENT_TYPES.IDENTITY_CARD],
      createdAt: new Date('2023-01-01'),
      expiresAt: new Date('2023-01-08'),
      updatedAt: new Date('2023-01-01')
    },
    {
      id: '2',
      civilId: '789012',
      requestedDocuments: [APP_DOCUMENT_TYPES.PASSPORT, APP_DOCUMENT_TYPES.UTILITY_BILL],
      createdAt: new Date('2023-01-02'),
      expiresAt: new Date('2023-01-09'),
      updatedAt: new Date('2023-01-03'),
      acceptedAt: new Date('2023-01-03')
    }
  ];

  const mockDeleteRequest = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useRequests as jest.Mock).mockReturnValue({
      requests: mockRequests,
      isLoaded: true,
      deleteRequest: mockDeleteRequest
    });

    (checkNotificationResponse as jest.Mock).mockResolvedValue(null);
    (window.confirm as jest.Mock).mockReturnValue(false);
  });

  test('renders loading state when not loaded', () => {
    (useRequests as jest.Mock).mockReturnValue({
      requests: [],
      isLoaded: false,
      deleteRequest: mockDeleteRequest,
      updateRequestStatus: mockUpdateRequestStatus
    });

    render(<RequestsList />);

    expect(screen.getByText('Chargement...')).toBeInTheDocument();
  });

  test('renders empty state when no requests', () => {
    (useRequests as jest.Mock).mockReturnValue({
      requests: [],
      isLoaded: true,
      deleteRequest: mockDeleteRequest,
      updateRequestStatus: mockUpdateRequestStatus
    });

    render(<RequestsList />);

    expect(screen.getByText('Demandes en cours')).toBeInTheDocument();
    expect(screen.getAllByText('Aucune demande en cours')).toHaveLength(2); // One for mobile, one for desktop
  });

  test('renders requests list correctly', () => {
    render(<RequestsList />);

    expect(screen.getByText('Demandes en cours')).toBeInTheDocument();

    // Check if both requests are rendered using regex to handle the split text
    expect(screen.getByText(/ID:\s*123456/)).toBeInTheDocument();
    expect(screen.getByText(/ID:\s*789012/)).toBeInTheDocument();

    // Check for civil IDs as separate elements as well
    expect(screen.getByText('123456')).toBeInTheDocument();
    expect(screen.getByText('789012')).toBeInTheDocument();

    // Check if status badges are rendered
    expect(screen.getAllByText('En attente')).toHaveLength(2);
    expect(screen.getAllByText('Accepté')).toHaveLength(2);

    // Check if document types are rendered
    expect(screen.getAllByText(APP_DOCUMENT_TYPE_TO_LABEL_MAP[APP_DOCUMENT_TYPES.IDENTITY_CARD])).toHaveLength(1);
    expect(screen.getAllByText(APP_DOCUMENT_TYPE_TO_LABEL_MAP[APP_DOCUMENT_TYPES.PASSPORT])).toHaveLength(1);
    expect(screen.getAllByText(APP_DOCUMENT_TYPE_TO_LABEL_MAP[APP_DOCUMENT_TYPES.UTILITY_BILL])).toHaveLength(1);
  });

  test('handles delete request', () => {
    (window.confirm as jest.Mock).mockReturnValue(true);

    render(<RequestsList />);

    // Find and click the first delete button (there will be two - one for mobile, one for desktop)
    const deleteButtons = screen.getAllByText('Supprimer');
    fireEvent.click(deleteButtons[0]);

    expect(window.confirm).toHaveBeenCalledWith('Êtes-vous sûr de vouloir supprimer cette demande ?');
    expect(mockDeleteRequest).toHaveBeenCalledWith('1');
  });

  test('does not delete when confirmation is canceled', () => {
    (window.confirm as jest.Mock).mockReturnValue(false);

    render(<RequestsList />);

    // Find and click the first delete button
    const deleteButtons = screen.getAllByText('Supprimer');
    fireEvent.click(deleteButtons[0]);

    expect(window.confirm).toHaveBeenCalled();
    expect(mockDeleteRequest).not.toHaveBeenCalled();
  });

  test('checks for notification responses on mount', async () => {
    const notificationResponse = {
      requestId: '1',
      response: 'ACCEPTED',
      timestamp: new Date().toISOString()
    };

    (checkNotificationResponse as jest.Mock).mockResolvedValue(notificationResponse);

    render(<RequestsList />);

    await waitFor(() => {
      expect(checkNotificationResponse).toHaveBeenCalled();
    });

    expect(mockUpdateRequestStatus).toHaveBeenCalledWith('1', 'ACCEPTED');
  });

  test('handles rejected notification response', async () => {
    const notificationResponse = {
      requestId: '1',
      response: 'REJECTED',
      timestamp: new Date().toISOString()
    };

    (checkNotificationResponse as jest.Mock).mockResolvedValue(notificationResponse);

    render(<RequestsList />);

    await waitFor(() => {
      expect(checkNotificationResponse).toHaveBeenCalled();
    });

    expect(mockUpdateRequestStatus).toHaveBeenCalledWith('1', 'REJECTED');
  });

  test('applies correct status badge classes', () => {
    render(<RequestsList />);

    // Find status badges
    const pendingBadge = screen.getAllByText('En attente')[0];
    const acceptedBadge = screen.getAllByText('Accepté')[0];

    // Check they have the correct classes
    expect(pendingBadge).toHaveClass('bg-yellow-100');
    expect(pendingBadge).toHaveClass('text-yellow-800');

    expect(acceptedBadge).toHaveClass('bg-green-100');
    expect(acceptedBadge).toHaveClass('text-green-800');
  });
});
