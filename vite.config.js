import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Actualiza el service worker automáticamente
      includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'AlPunto - Reservas y Citas',
        short_name: 'AlPunto',
        description: 'Encuentra y reserva en los mejores negocios de Nicolás Romero.',
        theme_color: '#FF6B00', // Tu color naranja principal
        background_color: '#0A0A0A', // Tu fondo oscuro
        display: 'standalone', // Se ve como una app nativa (sin barra del navegador)
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'favicon.svg',
            sizes: '192x192 512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            // Cachea las peticiones a Supabase (reservas, negocios, etc.)
            urlPattern: /^https:\/\/tyyslzfxbgqxlypwlgyj\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 1 día (86400 segundos)
              },
              networkTimeoutSeconds: 5,
            },
          },
          {
            // Cachea las imágenes de los negocios
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 días (2592000 segundos)
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: false, // Desactivado en desarrollo para no interferir con HMR
      },
    }),
  ],
});