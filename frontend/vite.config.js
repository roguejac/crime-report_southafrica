
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 2000 // Set higher than the default 500kB
  }
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
