import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Turbopack est activé par défaut dans Next.js 16
  turbopack: {}, // Ajoute cette ligne pour éviter les avertissements

  // Configuration des images (si nécessaire)
  images: {
    remotePatterns: [
      { hostname: 'pronta.corsica' }, // Remplace par tes domaines autorisés
    ],
  },

  ...(process.env.NODE_ENV === 'development' && {
    swcMinify: false,
  }),

  compiler: {
        removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },

};

export default nextConfig;
