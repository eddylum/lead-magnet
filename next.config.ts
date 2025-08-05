import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Configuration pour corriger l'encodage des apostrophes
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/html; charset=utf-8',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
