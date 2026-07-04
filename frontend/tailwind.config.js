/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#C5BAFF", // Light Purple
        secondary: "#C4D9FF", // Light Blue
        soft: "#E8F9FF",
        background: "#F4F6FB",
        sidebar: {
          DEFAULT: "#C5BAFF",
          light: "#D8CEFF",
          dark: "#B2A6FF",
        },
        accent: {
          indigo: "#6366F1",
          emerald: "#10B981",
          amber: "#F59E0B",
          rose: "#F43F5E",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        "card-hover": "0 10px 25px rgba(0,0,0,0.08)",
        glow: "0 0 20px rgba(196, 217, 255, 0.4)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
