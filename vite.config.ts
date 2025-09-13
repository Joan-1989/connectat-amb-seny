import { defineConfig } from 'vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  build: {
    rollupOptions: {
      // INDIQUEM A VITE QUE NO INCLOGUI AQUEST PAQUET:
      // Com que l'hem afegit a l'importmap de l'index.html, el navegador
      // ja sap d'on descarregar-lo. Això soluciona el conflicte.
      external: ['@google/genai'],
    },
  },
});

