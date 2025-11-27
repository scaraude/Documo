import { renderHook } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { useRequests } from '../useRequests';

// Mock TRPC
vi.mock('@/lib/trpc/client', () => ({
  trpc: {
    requests: {
      getAll: {
        useQuery: vi.fn(() => ({ data: [], isLoading: false })),
      },
      getById: {
        useQuery: vi.fn(() => ({ data: null, isLoading: false })),
      },
      create: {
        useMutation: vi.fn(() => ({
          mutateAsync: vi.fn(),
        })),
      },
    },
    useUtils: vi.fn(() => ({
      requests: {
        getAll: {
          invalidate: vi.fn(),
        },
      },
    })),
  },
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
