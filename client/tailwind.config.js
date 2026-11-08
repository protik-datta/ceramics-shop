/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { brand: { DEFAULT: '#E53935', dark: '#D1453B', deep: '#C62828' }, page: '#FAFAFA' },
      fontFamily: { sans: ['Inter', 'Hind Siliguri', 'Noto Sans Bengali', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};
