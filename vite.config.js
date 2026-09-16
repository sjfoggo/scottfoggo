import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const conceptRoutes = ['concept/tide', 'concept/lab'];

function conceptRouteEntrypoints() {
  return {
    name: 'concept-route-entrypoints',
    closeBundle() {
      const source = resolve('dist/index.html');

      conceptRoutes.forEach((route) => {
        const destination = resolve('dist', route, 'index.html');
        mkdirSync(dirname(destination), { recursive: true });
        copyFileSync(source, destination);
      });
    },
  };
}

export default defineConfig(() => {
  const noIndex = process.env.STAGING_NOINDEX === 'true';

  return {
    base: process.env.VITE_BASE_PATH || '/',
    plugins: [
      react(),
      conceptRouteEntrypoints(),
      {
        name: 'staging-noindex',
        transformIndexHtml() {
          return noIndex
            ? [{ tag: 'meta', attrs: { name: 'robots', content: 'noindex, nofollow' }, injectTo: 'head' }]
            : [];
        },
      },
    ],
    build: {
      rollupOptions: {
        output: {
          entryFileNames: 'assets/site.js',
          chunkFileNames: 'assets/[name].js',
          assetFileNames(assetInfo) {
            const names = assetInfo.names || [assetInfo.name || 'asset'];
            return names.some((name) => name.endsWith('.css'))
              ? 'assets/site.css'
              : 'assets/[name][extname]';
          },
        },
      },
    },
    test: {
      environment: 'jsdom',
      setupFiles: './src/tests/setupTests.js',
    },
  };
});
