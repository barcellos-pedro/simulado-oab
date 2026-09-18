/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: { ink: "#172033", brand: "#335cff", mint: "#0d9f77" },
    },
  },
  plugins: [],
};
