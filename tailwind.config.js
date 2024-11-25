/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all of your component files.
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
      extend: {
        boxShadow: {
          allDir: '0px 0px 53px 25px rgba(0, 0, 0, 0.3)'
        },

        colors: {
          mainBgColor: "#1B1B1B",
          primaryTextColor: "#F3ECEC",
          secondaryText: "#CFCFCF",
          accentColor: "#FF6E40",
          cardBackground: "#242424",
          borderColor: "#FF8A65"
        },

        animation:{
          rotate: "rotate4 2s linear infinite",
          dash: "dash 1.5s ease-in-out infinite",
        },

        keyframes:{
          rotate4:{
            "100%": {transform: "rotate(360deg)"}
          },
          dash:{
            "0%": {"stroke-dasharray": "1, 200", "stroke-dashoffset": "0"},
            "50%": {"stroke-dasharray": "90, 200", "stroke-dashoffset": "-35px"},
            "100%": {"stroke-dashoffset": "-125px"}
          },
        },
      },
    },
    plugins: [],
  }