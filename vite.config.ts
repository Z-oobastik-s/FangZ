import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// GitHub project Pages: https://<user>.github.io/FangZ/
export default defineConfig({
  plugins: [react()],
  base: '/FangZ/',
  build: {
    target: 'es2022',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
        },
      },
    },
  },
});
