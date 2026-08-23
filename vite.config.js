import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  const noIndex = process.env.STAGING_NOINDEX === 'true';

  return {
    base: process.env.VITE_BASE_PATH || '/',
    plugins: [
      react(),
      {
        name: 'staging-noindex',
        transformIndexHtml() {
          return noIndex
            ? [{ tag: 'meta', attrs: { name: 'robots', content: 'noindex, nofollow' }, injectTo: 'head' }]
            : [];
        },
      },
    ],
    test: {
      environment: 'jsdom',
      setupFiles: './src/tests/setupTests.js',
    },
  };
});
