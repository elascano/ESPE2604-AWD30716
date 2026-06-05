import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [vue()],
    server: {
        proxy: {
            '/computerstore': {
                target: 'http://localhost:3010',
                changeOrigin: true
            }
        }
    }
});