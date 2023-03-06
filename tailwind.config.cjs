/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'logo': ['Gotham'],
        'body': ['"Open Sans"']
      },
      animation: {
        "move-t": "move-t 1s ease-in-out",
        "move-r": "move-r 1.1s ease-in-out",
        "move-o": "move-o 1.2s ease-in-out",
        "move-dot": "move-dot 1.2s ease-in-out",
        "move-s": "move-h 1.1s ease-in-out",
        "move-h": "move-s 1s ease-in-out",
      },
      keyframes: {
        "move-t": {
          "0%": {
            transform: "translateX(5rem)",
          },
          "100%": {
            transform: "translateX(0)",
          },
        },
        "move-r": {
          "0%": {
            transform: "translateX(3.1rem)",
          },
          "100%": {
            transform: "translateX(0)",
          },
        },
        "move-o": {
          "0%": {
            transform: "translateX(1rem)",
          },
          "100%": {
            transform: "translateX(0)",
          },
        },
        "move-dot": {
          "0%": {
            transform: "translateX(-0.75rem)",
          },
          "100%": {
            transform: "translateX(0)",
          },
        },
        "move-s": {
          "0%": {
            transform: "translateX(-2.5rem)",
          },
          "100%": {
            transform: "translateX(0)",
          },
        },
        "move-h": {
          "0%": {
            transform: "translateX(-5rem)",
          },
          "100%": {
            transform: "translateX(0)",
          },
        },
      }
    },
  },
  plugins: [],
};

module.exports = config;
