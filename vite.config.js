import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(),tailwindcss()],
  base: '/accn/', // ✅ 確保 base 目錄對應 NAS 子目錄
  publicDir: 'public', // ✅ 確保 public 目錄正確
 
  server: {
    mimeTypes: {
      '.css': 'text/css', // ✅ 設置 CSS MIME 類型
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
