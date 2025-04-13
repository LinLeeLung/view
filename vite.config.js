import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import postcss from '@tailwindcss/postcss';

export default defineConfig({
  plugins: [vue()],
  css: {
    postcss: {
      plugins: [postcss()],
    },
  },
});