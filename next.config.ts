import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  /* config options here */
  // Avoid Windows symlink errors locally; enable via env for Docker/CI
  output: process.env.NEXT_STANDALONE === 'true' ? 'standalone' : undefined,
  outputFileTracingIncludes: {
    '/api/generate-jadwal-pdf': ['./lib/templates/**/*'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/iwkz/**',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
