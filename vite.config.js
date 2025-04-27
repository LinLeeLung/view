import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import postcss from '@tailwindcss/postcss';

export default defineConfig({
  plugins: [vue()],
  base: '/view/' , // ✅這裡要設定正確 repo 名
  css: {
    postcss: {
      plugins: [postcss()],
    },
  },
});