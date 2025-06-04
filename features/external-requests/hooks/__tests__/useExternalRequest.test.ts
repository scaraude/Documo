import { renderHook, act } from '@testing-library/react';
import { useExternalRequest } from '../useExternalRequest';
import { API_ROUTES } from '@/shared/constants';

// Mock fetch
global.fetch = jest.fn();

describe('useExternalRequest Hook', () => {
    const mockToken = 'test-token';
    const mockRequest = {
        id: 'req-123',
        civilId: 'civ-123',
        requestedDocuments: ['ID_CARD'],
        createdAt: new Date(),
        expiresAt: new Date()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should handle successful request fetch', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockRequest
        });

        const { result } = renderHook(() => useExternalRequest(mockToken));

        // Initially loading
        expect(result.current.isLoading).toBe(true);
        expect(result.current.error).toBeNull();
        expect(result.current.request).toBeNull();

        // Wait for the fetch to complete
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        // After successful fetch
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeNull();
        expect(result.current.request).toEqual(mockRequest);
        expect(global.fetch).toHaveBeenCalledWith(API_ROUTES.EXTERNAL.REQUEST(mockToken));
    });

    it('should handle request not found', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 404
        });

        const { result } = renderHook(() => useExternalRequest(mockToken));

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toEqual(new Error('Request not found'));
        expect(result.current.request).toBeNull();
    });

    it('should handle network errors', async () => {
        (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

        const { result } = renderHook(() => useExternalRequest(mockToken));

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toEqual(new Error('Network error'));
        expect(result.current.request).toBeNull();
    });

    it('should update loading state correctly', async () => {
        (global.fetch as jest.Mock).mockImplementationOnce(
            () => new Promise(resolve => setTimeout(() => resolve({
                ok: true,
                json: async () => mockRequest
            }), 100))
        );

        const { result } = renderHook(() => useExternalRequest(mockToken));

        // Initially loading
        expect(result.current.isLoading).toBe(true);

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 150));
        });

        // After fetch completes
        expect(result.current.isLoading).toBe(false);
    });
});
