import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    name: 'unit',
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: [
      'features/**/__tests__/**/*.{test,spec}.{ts,tsx}',
      'shared/**/__tests__/**/*.{test,spec}.{ts,tsx}',
      'app/**/__tests__/**/*.{test,spec}.{ts,tsx}',
    ],
    exclude: [
      '**/node_modules/**',
      '**/.next/**',
      '**/e2e/**',
      '**/repository/__tests__/**',
      '**/integration/__tests__/**',
      '**/__tests__/integration/**',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['features/**/*.{ts,tsx}', 'shared/**/*.{ts,tsx}'],
      exclude: ['**/*.d.ts', '**/node_modules/**', '**/__tests__/**'],
    },
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
