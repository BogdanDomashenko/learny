/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      container: {
        center: true,
      },
      colors: {
        primary: {
          50: '#fff7e6',
          100: '#ffe7ba',
          200: '#ffd591',
          300: '#ffc069',
          400: '#ffa940',
          500: '#fa8c16',
          600: '#d46b08',
          700: '#d46b08',
          800: '#ad4e00',
          900: '#873800',
          950: '#612500',
        },
      },
      fontFamily: {
        sans: ['Fredoka', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
