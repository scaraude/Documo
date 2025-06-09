// eslint-disable-next-line @typescript-eslint/no-require-imports
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.integration.js'],
  testEnvironment: 'node',
  moduleNameMapper: {
    // Handle module aliases (this is important for your @/ imports)
    '^@/(.*)$': '<rootDir>/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/', '<rootDir>/e2e/'],
  testMatch: [
    '**/__tests__/**/*.(test|spec).ts',
    '**/__tests__/**/*.(test|spec).tsx'
  ],
  collectCoverageFrom: [
    'features/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)