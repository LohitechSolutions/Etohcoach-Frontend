import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@schema': path.resolve(__dirname, '../firebase/content-schema.ts'),
    },
  },
  server: {
    port: 5174,
  },
});
