/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Lexend', 'sans-serif'],
      },
      colors: {
        "primary": "#11d411",
        "background-light": "#f6f8f6",
        "background-dark": "#102210",
      }
    },
  },
  plugins: [],
}