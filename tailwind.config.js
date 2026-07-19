/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#F7F0E3",
        parchment: "#FBF6EC",
        wine: "#6E1E2A",
        "wine-dark": "#4A1420",
        gold: "#C6A15B",
        "gold-soft": "#E4CFA0",
        ink: "#33251F",
        blush: "#E8CBB8",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        label: ["var(--font-label)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        script: ["var(--font-script)", "cursive"],
      },
    },
  },
  plugins: [],
};
