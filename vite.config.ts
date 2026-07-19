import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Served under /orbit/ on GitHub Pages (project site); "/" during local dev.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/orbit/' : '/',
  plugins: [react()],
}));
