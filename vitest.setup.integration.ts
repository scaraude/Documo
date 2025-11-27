import { beforeAll, vi } from 'vitest';
import { expect } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import { seedTestData } from './prisma/seed-test';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Global test database URL for integration tests
process.env.DATABASE_URL =
  process.env.TEST_DATABASE_URL ||
  'postgresql://postgres:password@localhost:5433/documo_test';

// Seed test data before all tests
beforeAll(async () => {
  await seedTestData();
});

// Mock Next.js router for tests
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock Web Crypto API for tests
Object.defineProperty(globalThis, 'crypto', {
  value: {
    getRandomValues: (arr: Uint8Array) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    },
    randomUUID: () => Math.random().toString(36).substring(2, 15),
    subtle: {
      generateKey: vi.fn(),
      exportKey: vi.fn(),
      importKey: vi.fn(),
      encrypt: vi.fn(),
      decrypt: vi.fn(),
    },
  },
});

// Mock Vercel Blob for tests
vi.mock('@vercel/blob', () => ({
  put: vi.fn(),
  del: vi.fn(),
}));
