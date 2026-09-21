/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#C8102E",
          dark: "#9B0D24",
          soft: "#FDECEF",
        },
        surface: "#F4F6FB",
        chip: "#E9EDF7",
        ink: "#0F172A",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 42, 0.05), 0 4px 16px rgba(15, 23, 42, 0.05)",
      },
    },
  },
  plugins: [],
};
