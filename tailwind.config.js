/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        google: {
          blue: '#1A73E8',
          blueLight: '#8AB4F8',
          red: '#EA4335',
          redLight: '#F28B82',
          yellow: '#FBBC04',
          yellowLight: '#FDD663',
          green: '#34A853',
          greenLight: '#81C995',
          dark: '#131314',
          surface: '#1E1F20',
          card: '#28292A',
          border: '#3C4043',
          hover: '#35363A'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Google Sans', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Google Sans', 'sans-serif'],
        mono: ['Fira Code', 'Roboto Mono', 'monospace']
      }
    },
  },
  plugins: [],
}
