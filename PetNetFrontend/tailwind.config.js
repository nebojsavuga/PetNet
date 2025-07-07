/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {

    },
    colors: {
      primary950: "#040321",
      primary900: "#080641",
      primary800: "#100C83",
      primary700: "#1812C4",
      primary600: "#3832EC",
      primary500: "#7873F2",
      primary400: "#928FF5",
      primary300: "#AEABF7",
      primary200: "#C9C7FA",
      primary100: "#E4E3FC",
      primary50: "#F1F1FE",

      greyscale50: "#F7F7F7",
      greyscale100: "#F0F0F0",
      greyscale200: "#E0E0E0",
      greyscale300: "#D1D1D1",
      greyscale400: "#C2C2C2",
      greyscale500: "#B3B3B3",
      greyscale600: "#8F8F8F",
      greyscale700: "#474747",
      greyscale900: "#242424",
      greyscale950: "#121212",
    }
  },
  plugins: [],
}

