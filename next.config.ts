import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: true,

  // Turbopack est activé par défaut dans Next.js 16
  turbopack: {}, // Ajoute cette ligne pour éviter les avertissements

  // Configuration des images (si nécessaire)
  images: {
    remotePatterns: [
      { hostname: 'pronta.corsica' }, // Remplace par tes domaines autorisés
    ],
  },

  compiler: {
    // swcMinify: false,
  },

  // Optionnel : désactive la compression pour voir les erreurs plus facilement
  compress: false,
};

export default nextConfig;
