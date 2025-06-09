// jest.setup.integration.js
import '@testing-library/jest-dom'
import { seedTestData } from './prisma/seed-test'

// Global test database URL for integration tests
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://postgres:password@localhost:5433/document_transfer_test'

// Seed test data before all tests
beforeAll(async () => {
  await seedTestData()
})

// Mock Next.js router for tests
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock Web Crypto API for tests
Object.defineProperty(globalThis, 'crypto', {
  value: {
    getRandomValues: (arr) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256)
      }
      return arr
    },
    randomUUID: () => Math.random().toString(36).substring(2, 15),
    subtle: {
      generateKey: jest.fn(),
      exportKey: jest.fn(),
      importKey: jest.fn(),
      encrypt: jest.fn(),
      decrypt: jest.fn(),
    }
  }
})

// Mock Vercel Blob for tests
jest.mock('@vercel/blob', () => ({
  put: jest.fn(),
  del: jest.fn(),
}))