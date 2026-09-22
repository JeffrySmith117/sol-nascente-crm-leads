/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#E10A2B",
          dark: "#A80720",
          soft: "#FF3B57",
        },
        // essas quatro seguem uma variável CSS (ver index.css): o mesmo nome de classe
        // (bg-night, text-ink/60...) muda de cor sozinho quando a landing troca de tema
        night: "rgb(var(--sn-surface) / <alpha-value>)",
        panel: "rgb(var(--sn-panel) / <alpha-value>)",
        panel2: "rgb(var(--sn-panel-2) / <alpha-value>)",
        ink: "rgb(var(--sn-ink) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Barlow Condensed", "Inter", "ui-sans-serif", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 60px rgba(225, 10, 43, 0.22)",
        card: "0 8px 30px rgba(0, 0, 0, 0.45)",
      },
    },
  },
  plugins: [],
};
