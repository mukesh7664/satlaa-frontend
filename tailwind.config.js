module.exports = {
  darkMode: "class",
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./myapp/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        square: "0 0 10px rgba(0, 0, 0, 0.3)", // Custom square shadow
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      animation: {
        marquee: "marquee 4s linear infinite",
      },
      spacing: {
        0.1: "1px",
        0.3: "3px",
        0.7: "7px",
      },
      backgroundImage: {
        "mobile-app": "url(images/image.png)",
      },
      fontFamily: {
        Samarkan: ["var(--font-samarkan)"],
        Lobster: ["var(--font-lobster)"],
        Montserrat: ["var(--font-montserrat)"],
        Nunito: ["var(--font-nunito)"],
        Poppins: ["var(--font-poppins)"],
        Dancing: ["var(--font-dancing)"],
        Sen: ["var(--font-sen)"],
        Roboto: ["var(--font-roboto)"],
      },
      colors: () => ({
        primary: "#e26f83",
        secondary: "#b57edc",
        accent: "#fedde6",
      }),
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    function ({ addUtilities }) {
      addUtilities({
        ".break-inside-avoid": {
          breakInside: "avoid",
        },
      });
    },
  ],
};
