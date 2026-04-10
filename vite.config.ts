/// <reference types="vite/client" />
import react from '@vitejs/plugin-react';
import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

function writeVersionJson(): { name: string; closeBundle: () => void } {
  return {
    name: 'fangz-version-json',
    closeBundle() {
      const build = process.env.GITHUB_SHA ?? `local-${Date.now()}`;
      const payload = JSON.stringify({ build, t: Date.now() });
      writeFileSync(resolve(__dirname, 'dist', 'version.json'), payload, 'utf8');
    },
  };
}

// GitHub project Pages: https://<user>.github.io/FangZ/
export default defineConfig({
  plugins: [react(), writeVersionJson()],
  base: '/FangZ/',
  build: {
    target: 'es2022',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/scheduler/')
          ) {
            return 'react-vendor';
          }
          const norm = id.replace(/\\/g, '/');
          if (norm.includes('/src/features/trainer/')) return 'trainer';
          if (norm.includes('/src/features/hub/')) return 'hub';
        },
      },
    },
  },
});
