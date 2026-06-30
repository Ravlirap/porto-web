import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['*'], // izinkan semua host
    port: 8080,
  },
  preview: {
    allowedHosts: ['*'],
    port: 8080,
  },
})