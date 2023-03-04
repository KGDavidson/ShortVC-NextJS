/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'logo': ['Gotham'],
        'body': ['"Open Sans"']
      }
    },
  },
  plugins: [],
};

module.exports = config;
