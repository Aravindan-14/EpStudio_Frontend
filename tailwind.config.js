/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backdropBlur: {
        custom: "1px",
      },
      backgroundImage: {
        'custom-gradient': 'linear-gradient(131deg, rgba(186, 186, 186, 0.01) 0%, rgba(186, 186, 186, 0.01) 16.667%, rgba(192, 192, 192, 0.01) 16.667%, rgba(192, 192, 192, 0.01) 33.334%, rgba(48, 48, 48, 0.01) 33.334%, rgba(48, 48, 48, 0.01) 50.001%, rgba(33, 33, 33, 0.01) 50.001%, rgba(33, 33, 33, 0.01) 66.668%, rgba(182, 182, 182, 0.01) 66.668%, rgba(182, 182, 182, 0.01) 83.335%, rgba(211, 211, 211, 0.01) 83.335%, rgba(211, 211, 211, 0.01) 100.002%), linear-gradient(148deg, rgba(48, 48, 48, 0.01) 0%, rgba(48, 48, 48, 0.01) 16.667%, rgba(178, 178, 178, 0.01) 16.667%, rgba(178, 178, 178, 0.01) 33.334%, rgba(192, 192, 192, 0.01) 33.334%, rgba(192, 192, 192, 0.01) 50.001%, rgba(237, 237, 237, 0.01) 50.001%, rgba(237, 237, 237, 0.01) 66.668%, rgba(194, 194, 194, 0.01) 66.668%, rgba(194, 194, 194, 0.01) 83.335%, rgba(227, 227, 227, 0.01) 83.335%, rgba(227, 227, 227, 0.01) 100.002%), linear-gradient(138deg, rgba(146, 146, 146, 0.03) 0%, rgba(146, 146, 146, 0.03) 25%, rgba(33, 33, 33, 0.03) 25%, rgba(33, 33, 33, 0.03) 50%, rgba(46, 46, 46, 0.03) 50%, rgba(46, 46, 46, 0.03) 75%, rgba(172, 172, 172, 0.03) 75%, rgba(172, 172, 172, 0.03) 100%), linear-gradient(38deg, rgba(3, 3, 3, 0.03) 0%, rgba(3, 3, 3, 0.03) 16.667%, rgba(28, 28, 28, 0.03) 16.667%, rgba(28, 28, 28, 0.03) 33.334%, rgba(236, 236, 236, 0.03) 33.334%, rgba(236, 236, 236, 0.03) 50.001%, rgba(3, 3, 3, 0.03) 50.001%, rgba(3, 3, 3, 0.03) 66.668%, rgba(207, 207, 207, 0.03) 66.668%, rgba(207, 207, 207, 0.03) 83.335%, rgba(183, 183, 183, 0.03) 83.335%, rgba(183, 183, 183, 0.03) 100.002%), linear-gradient(145deg, rgba(20, 20, 20, 0.02) 0%, rgba(20, 20, 20, 0.02) 20%, rgba(4, 4, 4, 0.02) 20%, rgba(4, 4, 4, 0.02) 40%, rgba(194, 194, 194, 0.02) 40%, rgba(194, 194, 194, 0.02) 60%, rgba(34, 34, 34, 0.02) 60%, rgba(34, 34, 34, 0.02) 80%, rgba(71, 71, 71, 0.02) 80%, rgba(71, 71, 71, 0.02) 100%), linear-gradient(78deg, rgba(190, 190, 190, 0.02) 0%, rgba(190, 190, 190, 0.02) 20%, rgba(95, 95, 95, 0.02) 20%, rgba(95, 95, 95, 0.02) 40%, rgba(71, 71, 71, 0.02) 40%, rgba(71, 71, 71, 0.02) 60%, rgba(7, 7, 7, 0.02) 60%, rgba(7, 7, 7, 0.02) 80%, rgba(130, 130, 130, 0.02) 80%, rgba(130, 130, 130, 0.02) 100%), linear-gradient(293deg, rgba(213, 213, 213, 0.03) 0%, rgba(213, 213, 213, 0.03) 20%, rgba(220, 220, 220, 0.03) 20%, rgba(220, 220, 220, 0.03) 40%, rgba(146, 146, 146, 0.03) 40%, rgba(146, 146, 146, 0.03) 60%, rgba(57, 57, 57, 0.03) 60%, rgba(57, 57, 57, 0.03) 80%, rgba(120, 120, 120, 0.03) 80%, rgba(120, 120, 120, 0.03) 100%), linear-gradient(90deg, rgba(219, 15, 225, 0.57), rgb(78, 198, 243))',
      },
      fontFamily: {
        gloria: ["Gloria Hallelujah", "cursive"],
        waterBrush: ["Water Brush", "serif"],
        paint: ["Rubik Wet Paint", "serif"]
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
