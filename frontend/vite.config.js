import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true, // Ép Vite phải quét file liên tục
      interval: 100,    // Kiểm tra mỗi 100ms
    },
    host: true,         // Phải có để Docker mapping cổng
    port: 5173,
  }
})
