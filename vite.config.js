import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: true, // bypass host-check sepenuhnya (untuk testing via tunnel)
    host: true,          // listen di 0.0.0.0 supaya cloudflared bisa proxy ke sini
    port: 8080,
  },
  preview: {
    allowedHosts: true,
    host: true,
    port: 8080,
  },
})