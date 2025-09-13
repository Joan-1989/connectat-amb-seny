import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    // IMPORTANT: no excloem l’SDK de Gemini del bundle
    rollupOptions: {
      // No 'external' per @google/generative-ai
    }
  },
  // (opcional) per tenir variables en codi si en vols afegir via define
  // define: {
  //   __APP_VERSION__: JSON.stringify('1.0.0'),
  // },
});
