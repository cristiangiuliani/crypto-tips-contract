import react from '@vitejs/plugin-react';

import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';

export default defineConfig({
  plugins: [
    react(),
    eslint({
      cache: false,
      include: ['./src/**/*.js', './src/**/*.jsx', './src/**/*.ts', './src/**/*.tsx'],
      exclude: ['node_modules'],
      failOnError: false,
      failOnWarning: false,
      emitWarning: true,
      emitError: true,
    }),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    hmr: {
      overlay: true,
    },
    
  },
});
