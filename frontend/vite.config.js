import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    watch: {
      usePolling: true, // Ép Vite phải quét file liên tục
      interval: 100,    // Kiểm tra mỗi 100ms
    },
    host: true,         // Phải có để Docker mapping cổng
    port: 5173,
  }
})
