const { heroui } = require("@heroui/theme");

/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      fontFamily: {
        "nunito-sans": ["var(--font-nunito-sans)"],
        "work-sans": ["var(--font-work-sans)"],
      },

      maxWidth: {
        "4.5xl": "60rem",
      },

      colors: {
        gray: {
          100: "#ccd1d2",
          200: "#aaa",
          300: "#808080",
          400: "#666666",
          500: "#484848",
          600: "#343333",
        },

        pink: {
          pink: "#FF006B",
        },

        blue: {
          blue: "#0272FA",
        },
      },

      backgroundColor: {
        dark: "#191919",
        pink: "#FF006B",
        blue: "#0272FA",
      },

      borderRadius: {
        "2.5xl": "1.25rem",
      },

      backgroundImage: {
        "gradient-primary": "linear-gradient(90deg, #0272FA 0%, #FF006B 160%)",

        "gradient-secondary":
          "linear-gradient(90deg, #0272FA 0%, #FF006B 100%)",

        "gradient-dark": "linear-gradient(180deg, #252525 0%, #000 100%)",
        "gradient-dark/60":
          "linear-gradient(180deg, rgba(37, 37, 37, 0.60) 0%, rgba(0, 0, 0, 0.60) 100%)",

        "gradient-rank-initiate":
          "linear-gradient(90deg, #4E728C 0%, #83B0CB 100%)",

        "gradient-rank-operator":
          "linear-gradient(90deg, #206A76 0%, #49D1B7 100%);",

        "gradient-rank-sentinel":
          "linear-gradient(90deg, #FFB400 0%, #906B11 100%)",

        "gradient-rank-architect":
          "linear-gradient(90deg, #A3282B 0%, #F62F4E 100%)",
      },
    },

    animation: {
      scrollY:
        "scrollY var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite",
    },

    keyframes: {
      scrollY: {
        to: {
          transform: "translateY(calc(-50% - 0.5rem))",
        },
      },
    },
  },

  darkMode: "class",

  plugins: [heroui()],
};
