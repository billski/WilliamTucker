/** @type {import('tailwindcss').Config} */
export default {
  content: ["./**/*.html"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1a2332',
          light: '#243044',
          dark: '#111827',
        },
        gold: {
          DEFAULT: '#d4a843',
          light: '#e0be6a',
          dark: '#b8912e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
