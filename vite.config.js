import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    allowedHosts: ['bee.shu-le.tech', 'localhost', '127.0.0.1'],
    host: '0.0.0.0'
  }
})

