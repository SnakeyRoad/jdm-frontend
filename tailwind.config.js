/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'jdm-blue': {
          light: '#60a5fa',
          DEFAULT: '#3b82f6',
          dark: '#1e3a8a',
        },
        'jdm-green': {
          light: '#86efac',
          DEFAULT: '#60a5fa',
          dark: '#166534',
        },
      },
      fontFamily: {
        'comic': ['"Comic Sans MS"', 'cursive'],
      }
    },
  },
  plugins: [],
}
