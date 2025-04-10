import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  base: '/accn/', // ✅ GitHub Pages 專案名
  plugins: [vue()],
  publicDir: 'public',
  server: {
    mimeTypes: {
      '.css': 'text/css',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
