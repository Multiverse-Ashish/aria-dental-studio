import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/aria-dental-studio/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        contact: resolve(__dirname, 'contact.html')
      }
    }
  }
});
