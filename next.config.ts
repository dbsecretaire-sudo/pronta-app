// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Turbopack est activé par défaut dans Next.js 16
  turbopack: {},

  // Configuration des images
  images: {
    remotePatterns: [
      { hostname: 'pronta.corsica' },
    ],
  },

  // Configuration des rewrites pour les routes API
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://app.pronta.corsica/api/:path*' // Remplacez par l'URL de votre backend si différent
      }
    ];
  },

  // Configuration pour éviter les problèmes de CORS
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  }
};

export default nextConfig;
