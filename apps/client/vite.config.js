import path from 'path';

import { sentryVitePlugin } from '@sentry/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { compression } from 'vite-plugin-compression2';
import { VitePWA } from 'vite-plugin-pwa';
import svgrPlugin from 'vite-plugin-svgr';

import { ONTIME_VERSION } from './src/ONTIME_VERSION';

const sentryAuthToken = process.env.SENTRY_AUTH_TOKEN;

const ReactCompilerConfig = {
  compilationMode: 'annotation',
};

export default defineConfig({
  base: './', // Ontime cloud: we use relative paths to allow them to reference a dynamic base set at runtime
  define: {
    // we pass along the NODE_ENV here in case it is a docker build
    'import.meta.env.IS_DOCKER': process.env.NODE_ENV === 'docker',
  },
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', ReactCompilerConfig]],
      },
    }),
    svgrPlugin(),
    sentryAuthToken &&
      sentryVitePlugin({
        org: 'get-ontime',
        project: 'ontime',
        include: './build',
        authToken: sentryAuthToken,
        release: ONTIME_VERSION,
        deploy: {
          env: 'production',
        },
        bundleSizeOptimizations: {
          excludeDebugStatements: true,
          excludeReplayIframe: true,
          excludeReplayShadowDom: true,
          excludeReplayWorker: true,
        },
      }),
    compression({
      algorithm: 'brotliCompress',
      exclude: /\.(html)$/, // Ontime cloud: Exclude HTML files from compression so we can change the base property at runtime
    }),
    VitePWA({
      registerType: 'autoUpdate',
      // Disable service worker in development to avoid conflicts with HMR
      disable: process.env.NODE_ENV === 'development',
      // Disable manifest generation - server provides dynamic manifest
      manifest: false,
      // Minimal workbox config - network-only since Ontime requires LAN connection
      workbox: {
        // Don't precache any assets - we want fresh files from the server
        globPatterns: [],
        // Runtime caching: only cache the app shell for installability
        runtimeCaching: [
          {
            urlPattern: ({ url }) => {
              // Cache only the root HTML for app shell
              return url.pathname === '/' || url.pathname === '/index.html';
            },
            handler: 'NetworkFirst',
            options: {
              cacheName: 'app-shell',
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 24 * 60 * 60, // 1 day
              },
            },
          },
        ],
        // Skip waiting to activate new service worker immediately
        skipWaiting: true,
        clientsClaim: true,
      },
    }),
  ],
  server: {
    port: 3000,
    proxy: {
      '^/login*': {
        target: 'http://localhost:4001/',
        changeOrigin: true,
        configure: logProxyRequests,
      },
      '^/data*': {
        target: 'http://localhost:4001/',
        changeOrigin: true,
        configure: logProxyRequests,
      },
      '^/api*': {
        target: 'http://localhost:4001/',
        changeOrigin: true,
        configure: logProxyRequests,
      },
      '^/ws*': {
        target: 'http://localhost:4001/',
        changeOrigin: true,
        configure: logProxyRequests,
        ws: true,
      },
      '^/user*': {
        target: 'http://localhost:4001/',
        changeOrigin: true,
        configure: logProxyRequests,
        ws: true,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
  build: {
    outDir: './build',
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
        @use '@/theme/themeTokens' as *;
        `,
      },
    },
  },
});

function logProxyRequests(proxy) {
  proxy.on('proxyReq', (_proxyReq, req, _res) => {
    console.log('Proxy:', req.method, req.url);
  });
}
