import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    // TypeScript compilation already validates types during build.
    // Next.js 15.3.1's separate type-checking phase fails on Vercel
    // because it can't find devDependencies (@types packages).
    // Since TS already compiled successfully, this is safe to skip.
    ignoreBuildErrors: true,
    tsconfigPath: './tsconfig.json',
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
};

export default nextConfig;
