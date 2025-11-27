import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    name: 'integration',
    environment: 'node',
    setupFiles: ['./vitest.setup.integration.ts'],
    include: [
      '**/repository/__tests__/**/*.{test,spec}.ts',
      '**/integration/__tests__/**/*.{test,spec}.{ts,tsx}',
      '**/types/__tests__/**/*.{test,spec}.ts',
    ],
    exclude: ['**/node_modules/**', '**/.next/**', '**/e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['features/**/*.{ts,tsx}'],
      exclude: ['**/*.d.ts', '**/node_modules/**', '**/__tests__/**'],
    },
    // Integration tests may need more time
    testTimeout: 10000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@/features': path.resolve(__dirname, './features'),
      '@/shared': path.resolve(__dirname, './shared'),
      '@/lib': path.resolve(__dirname, './lib'),
      '@/app': path.resolve(__dirname, './app'),
    },
  },
});
