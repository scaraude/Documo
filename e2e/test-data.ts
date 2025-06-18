import { TEST_USERS } from '../prisma/seed';

// Re-export test users for easier imports in E2E tests
export { TEST_USERS };

// Additional test data that might be useful for E2E tests
export const TEST_DATA = {
  // Invalid credentials for testing error cases
  invalidUser: {
    email: 'nonexistent@example.com',
    password: 'wrongpassword',
  },

  // Invalid email formats for validation testing
  invalidEmails: [
    'invalid-email',
    'invalid@',
    '@invalid.com',
    'invalid..email@test.com',
  ],

  // Common test passwords
  passwords: {
    tooShort: '123',
    valid: 'password123',
    strong: 'StrongPassword123!',
  },
} as const;
