import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 768, 1024, 1280, 1920],
  },
  compress: true,
  headers: async () => [
    {
      source: '/audio/:path*',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=604800, immutable' },
      ],
    },
    {
      // Cache static 3D assets aggressively
      source: '/models/:path*',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=604800, immutable' },
      ],
    },
    {
      source: '/images/:path*',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=604800, immutable' },
      ],
    },
    {
      source: '/api/beats',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=86400' },
      ],
    },
  ],
  experimental: {
    optimizePackageImports: [
      'three',
      '@react-three/fiber',
      '@react-three/drei',
      '@react-three/postprocessing',
      'postprocessing',
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Tree-shake heavy Three.js extras we don't use
      config.resolve.alias = {
        ...config.resolve.alias,
      }
    }
    return config
  },
};

export default nextConfig;
