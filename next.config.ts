import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
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

export default nextConfig;
