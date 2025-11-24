import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './', // Important! Use relative paths for Cloudflare
  build: {
    outDir: 'dist', // output folder
    emptyOutDir: true, // clears old files on each build
  },
})
