/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      inherit: "inherit",
      current: "currentColor",
      transparent: "transparent",
      white: "#ffffff",
      primary: "#6366F1",
      accent: "#F97316",
      red: {
        500: "#EF4444",
        600: "#DC2626",
      },
      emerald: {
        50: "#F0FDF4",
        600: "#16A34A",
        700: "#15803D",
      },
      amber: {
        600: "#D97706",
        700: "#B45309",
      },
      slate: {
        50: "#f8f7ff",
        100: "#f1eff9",
        200: "#e5e3ff",
        300: "#d0cce6",
        400: "#a09dc0",
        500: "#6B7280",
        600: "#4b5563",
        700: "#374151",
        800: "#1e293b",
        900: "#0f172a",
        950: "#0F0D1A",
      },
      indigo: {
        600: "#4F46E5",
      },
    },
    fontFamily: {
      sans: ["Inter", "system-ui", "sans-serif"],
    },
    borderRadius: {
      DEFAULT: "0.75rem",
      lg: "0.5rem",
      "2xl": "1rem",
      "3xl": "1.5rem",
      full: "9999px",
    },
  },
  plugins: [],
}
