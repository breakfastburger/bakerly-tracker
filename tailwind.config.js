/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bakerly: {
          primary: '#35c3f5',
        }
      }
    },
  },
  plugins: [],
}
