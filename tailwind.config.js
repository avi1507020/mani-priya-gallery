/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rose: {
          DEFAULT: '#FF4D8D',
          500: '#FF4D8D',
        },
        gold: {
          DEFAULT: '#FFD700',
          500: '#FFD700',
        },
        lavender: '#C8A2C8',
        peach: '#FFE5B4',
        dark: '#1A0A2E',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        poppins: ['"Poppins"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
