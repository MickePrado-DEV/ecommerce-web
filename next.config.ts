import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co', pathname: '/**' },
      { protocol: 'http', hostname: 'localhost', port: '5088', pathname: '/**' },
    ],
  },
};

export default nextConfig;
