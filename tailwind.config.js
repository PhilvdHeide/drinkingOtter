/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6',
          dark: '#1d4ed8'
        },
        background: {
          DEFAULT: '#ffffff',
          dark: '#0f172a'
        }
      }
    },
  },
  plugins: [],
}
