/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Lexend', 'sans-serif'],
        // Condensada estilo letreiro de camisa/placar: nomes de clube e números.
        kit: ['"Barlow Condensed"', 'sans-serif'],
      },
      colors: {
        // Paleta "gramado à noite": tudo deriva daqui.
        pitch: {
          950: '#0b1a10',
          900: '#112417',
          800: '#183020',
          700: '#22412c',
        },
        chalk: '#eef5ee',
        muted: '#9db5a3',
        neon: '#11d411',
        gold: '#e7c35a',
      },
    },
  },
  plugins: [],
};
