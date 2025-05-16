import { renderHook, act, waitFor } from '@testing-library/react';
import { useRequest } from '../useRequest';
import * as requestsApi from '../../api/requestApi';
import { APP_DOCUMENT_TYPES, DOCUMENT_REQUEST_STATUS } from '@/shared/constants';
import { DocumentRequest } from '@/shared/types';

// Mock the API module
jest.mock('../../api/requestApi');

const mockRequestsApi = requestsApi as jest.Mocked<typeof requestsApi>;

describe('useRequest Hook', () => {
  const mockRequests: DocumentRequest[] = [
    {
      id: '1',
      civilId: '123456',
      requestedDocuments: [APP_DOCUMENT_TYPES.IDENTITY_CARD],
      status: DOCUMENT_REQUEST_STATUS.PENDING,
      createdAt: new Date('2023-01-01'),
      expiresAt: new Date('2023-01-08'),
      updatedAt: new Date('2023-01-01')
    },
    {
      id: '2',
      civilId: '789012',
      requestedDocuments: [APP_DOCUMENT_TYPES.PASSPORT, APP_DOCUMENT_TYPES.UTILITY_BILL],
      status: DOCUMENT_REQUEST_STATUS.ACCEPTED,
      createdAt: new Date('2023-01-02'),
      expiresAt: new Date('2023-01-09'),
      updatedAt: new Date('2023-01-03')
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequestsApi.getRequests.mockResolvedValue(mockRequests);
  });

  test('should load requests on mount', async () => {
    mockRequestsApi.getRequests.mockResolvedValue(mockRequests);

    const { result } = renderHook(() => useRequest());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isLoaded).toBe(false);

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });

    expect(result.current.requests).toEqual(mockRequests);
    expect(result.current.isLoading).toBe(false);
    expect(mockRequestsApi.getRequests).toHaveBeenCalledTimes(1);
  });

  test('should handle error when loading requests', async () => {
    const error = new Error('Failed to fetch');
    mockRequestsApi.getRequests.mockRejectedValue(error);

    const { result } = renderHook(() => useRequest());

    await waitFor(() => {
      expect(result.current.error).toEqual(error);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isLoaded).toBe(false);
  });

  test('should create request successfully', async () => {
    const newRequest: DocumentRequest = {
      id: '3',
      civilId: '555666',
      requestedDocuments: [APP_DOCUMENT_TYPES.BANK_STATEMENT],
      status: DOCUMENT_REQUEST_STATUS.PENDING,
      createdAt: new Date(),
      expiresAt: new Date(),
      updatedAt: new Date()
    };

    mockRequestsApi.createRequest.mockResolvedValue(newRequest);
    mockRequestsApi.getRequests.mockResolvedValue(mockRequests);

    const { result } = renderHook(() => useRequest());

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });

    await act(async () => {
      const returnedRequest = await result.current.createRequest(
        '555666',
        [APP_DOCUMENT_TYPES.BANK_STATEMENT]
      );
      expect(returnedRequest).toEqual(newRequest);
    });

    expect(mockRequestsApi.createRequest).toHaveBeenCalledWith({
      civilId: '555666',
      requestedDocuments: [APP_DOCUMENT_TYPES.BANK_STATEMENT],
      expirationDays: undefined
    });

    expect(result.current.requests).toEqual([...mockRequests, newRequest]);
  });

  test('should handle error when creating request', async () => {
    const error = new Error('Failed to create request');
    mockRequestsApi.createRequest.mockRejectedValue(error);
    mockRequestsApi.getRequests.mockResolvedValue(mockRequests);

    const { result } = renderHook(() => useRequest());

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });

    await act(async () => {
      try {
        await result.current.createRequest('555666', [APP_DOCUMENT_TYPES.BANK_STATEMENT]);
      } catch (e) {
        expect(e).toEqual(error);
      }
    });

    expect(result.current.error).toEqual(error);
  });

  test('should update request status successfully', async () => {
    const updatedRequest = {
      ...mockRequests[0],
      status: DOCUMENT_REQUEST_STATUS.ACCEPTED,
      updatedAt: new Date()
    };

    mockRequestsApi.updateRequestStatus.mockResolvedValue(updatedRequest);
    mockRequestsApi.getRequests.mockResolvedValue(mockRequests);

    const { result } = renderHook(() => useRequest());

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });

    await act(async () => {
      await result.current.updateRequestStatus('1', DOCUMENT_REQUEST_STATUS.ACCEPTED);
    });

    expect(mockRequestsApi.updateRequestStatus).toHaveBeenCalledWith('1', DOCUMENT_REQUEST_STATUS.ACCEPTED);

    const expectedRequests = [updatedRequest, mockRequests[1]];
    expect(result.current.requests).toEqual(expectedRequests);
  });

  test('should delete request successfully', async () => {
    mockRequestsApi.deleteRequest.mockResolvedValue();
    mockRequestsApi.getRequests.mockResolvedValue(mockRequests);

    const { result } = renderHook(() => useRequest());

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });

    await act(async () => {
      await result.current.deleteRequest('1');
    });

    expect(mockRequestsApi.deleteRequest).toHaveBeenCalledWith('1');
    expect(result.current.requests).toEqual([mockRequests[1]]);
  });
});
