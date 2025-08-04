// 1. first check 
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

//2nd check
// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import { VitePWA } from 'vite-plugin-pwa';

// export default defineConfig({
//   plugins: [
//     react(),
//     VitePWA({
//       registerType: 'autoUpdate',
//       includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg', 'offline.html'],
//       manifest: {
//         name: 'Lohiya Store',
//         short_name: 'Lohiya',
//         description: 'Lohiya - Fresh Groceries Delivered to Your Door',
//         theme_color: '#ffffff',
//         icons: [
//           {
//             src: 'logo-bg.svg',
//             sizes: '192x192',
//             type: 'image/png'
//           },
//           {
//             src: 'logo-bg.svg',
//             sizes: '512x512',
//             type: 'image/png'
//           }
//         ]
//       },
//       workbox: {
//         globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
//         navigateFallback: 'offline.html',
//         runtimeCaching: [
//           {
//             urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
//             handler: 'CacheFirst',
//             options: {
//               cacheName: 'google-fonts-cache',
//               expiration: {
//                 maxEntries: 10,
//                 maxAgeSeconds: 60 * 60 * 24 * 365 
//               },
//               cacheableResponse: {
//                 statuses: [0, 200]
//               }
//             }
//           },
//           {
//             urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
//             handler: 'CacheFirst',
//             options: {
//               cacheName: 'gstatic-fonts-cache',
//               expiration: {
//                 maxEntries: 10,
//                 maxAgeSeconds: 60 * 60 * 24 * 365 
//               },
//               cacheableResponse: {
//                 statuses: [0, 200]
//               }
//             }
//           }
//         ]
//       },
//       devOptions: {
//         enabled: true 
//       }
//     })
//   ]
// });


// 3rd check 

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png',
        'mask-icon.svg',
        'offline.html'
      ],
      manifest: {
        name: 'Lohiya Store',
        short_name: 'Lohiya',
        description: 'Lohiya - Fresh Groceries Delivered to Your Door',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'logo-bg.svg',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'logo-bg.svg',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        navigateFallback: '/offline.html',
        navigateFallbackDenylist: [
          /\/api\//,
          /\/assets\//,
          /\/icons\//,
          /\/images\//,
          /\/fonts\//,
          /\/_next\//,
        ],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ]
});
