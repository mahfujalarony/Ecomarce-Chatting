import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { UNIFIED_BASE_URL } from './src/config/env.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['.ngrok-free.dev'],
    proxy: {
      '/api': {
        target: UNIFIED_BASE_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/chatbackend/api'),
      },
      '/socket.io': {
        target: UNIFIED_BASE_URL,
        changeOrigin: true,
        ws: true,
      },
      '/upload': {
        target: UNIFIED_BASE_URL,
        changeOrigin: true,
      },
      '/public': {
        target: UNIFIED_BASE_URL,
        changeOrigin: true,
      },
      '/create-folder': {
        target: UNIFIED_BASE_URL,
        changeOrigin: true,
      },
      '/delete': {
        target: UNIFIED_BASE_URL,
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
