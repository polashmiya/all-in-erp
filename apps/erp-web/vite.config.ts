import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import { vendorChunks } from '../../vite.shared.ts';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: { port: 5174, strictPort: true },
  preview: { port: 4174, strictPort: true },
  build: { rolldownOptions: { output: { codeSplitting: vendorChunks } } },
});
