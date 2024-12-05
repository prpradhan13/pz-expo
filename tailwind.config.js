/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all of your component files.
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
      extend: {
        colors: {
          mainBgColor: "#1B1B1B",
          primaryTextColor: "#F3ECEC",
          secondaryText: "#CFCFCF",
          accentColor: "#FF6E40",
          cardBackground: "#242424",
          borderColor: "#FF8A65"
        },
      },
    },
    plugins: [],
  }