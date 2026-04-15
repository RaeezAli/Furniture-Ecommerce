/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Poppins"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-pattern': "url('./src/Images/Home/home-background.png')",
        'common-background': "url('./src/Images/Common/Common.jpeg')",
      },
      screens: {
        'xs': '400px',
      },
    },
  },
  plugins: [],
}