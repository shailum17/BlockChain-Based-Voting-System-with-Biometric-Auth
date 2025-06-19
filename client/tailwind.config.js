/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode:"class",

  theme: {
    extend: {
      colors: {
        'light-blue': colors.lightBlue,
        sky: colors.sky,
      },
    },
  },
  variants: {},
  plugins: [],
}


// theme: {
//   extend: {},
// },
// plugins: [],