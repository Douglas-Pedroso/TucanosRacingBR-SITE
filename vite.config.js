import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/TucanosRacingBR-SITE/',
  build: {
    outDir: 'public',
    assetsDir: 'assets',
  },
  publicDir: 'docs',
  server: {
    port: 5173,
    strictPort: false,
  },
})
