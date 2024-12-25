/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backdropBlur: {
        custom: "1px",
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar")({ nocompatible: true }),
    function ({ addComponents }) {
      addComponents({
        ".scrollbar-custom": {
          "&::-webkit-scrollbar": {
            width: "4px" /* Set custom width for the scrollbar */,
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1" /* Track color */,
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#3A5BC7" /* Thumb color */,
            borderRadius: "10px" /* Rounded corners */,
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#fffff" /* Thumb hover color */,
          },
        },
      });
    },
  ],
};
