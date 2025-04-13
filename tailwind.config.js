/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {},
    },
    plugins: [],
    future: {
    // ✅ 關閉 oklch 色彩函數
    useOklchColor: false
  }
  }
  