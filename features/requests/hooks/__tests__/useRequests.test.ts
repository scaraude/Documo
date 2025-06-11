import { renderHook } from '@testing-library/react';
import { useRequests } from '../useRequests';

// Mock TRPC
jest.mock('@/lib/trpc/client', () => ({
  trpc: {
    requests: {
      getAll: {
        useQuery: jest.fn(() => ({ data: [], isLoading: false }))
      },
      getById: {
        useQuery: jest.fn(() => ({ data: null, isLoading: false }))
      },
      create: {
        useMutation: jest.fn(() => ({
          mutateAsync: jest.fn()
        }))
      }
    },
    useUtils: jest.fn(() => ({
      requests: {
        getAll: {
          invalidate: jest.fn()
        }
      }
    }))
  }
}));

describe('useRequests Hook', () => {
  test('should return hook functions', () => {
    const { result } = renderHook(() => useRequests());

    expect(result.current).toHaveProperty('getById');
    expect(result.current).toHaveProperty('getAllRequests');
    expect(result.current).toHaveProperty('createRequest');

    expect(typeof result.current.getById).toBe('function');
    expect(typeof result.current.getAllRequests).toBe('function');
    expect(typeof result.current.createRequestMutation).toBe('function');
  });
});