import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'views/index.html'),
        register: resolve(__dirname, 'views/register.html')
      }
    }
  },
  server: {
    port: 5173,
    host: true
  }
});
