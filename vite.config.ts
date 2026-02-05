import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: '.', // Serve from the current directory
  build: {
    outDir: 'dist',
  }
});