import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    // This makes production builds fail if there are TypeScript errors
    ignoreBuildErrors: false,
    // This makes development mode fail if there are TypeScript errors
    tsconfigPath: './tsconfig.json',
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
};

export default nextConfig;
