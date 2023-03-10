module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      desktop: { max: "5000px" },
      laptop: { max: "1200px" },
      mobile: { max: "767px" },
      xmobile: { max: "550px" },
    },
    extend: {
      colors: {
        primary: "#BEE719",
        "primary-light": "#E8FF89",
        grey: "#8F8F8F",
        secondary: "#EAB946",
        "grey-300": "#343434",
        "grey-light": "#CFCFD0",
      },
    },
    fontFamily: {
      worksans: ["WorkSans", "sans-serif"],
      pixel: ["Pixel", "sans-serif"],
    },
  },
  plugins: [],
  important: true,
};
