/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}", "./index.html"],
  theme: {
    extend: {
      backdropBlur: {
        md: "10px",
      },
      scale: {
        105: "1.05",
      },
    },
  },
  plugins: [],
};