/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#27447C",
        accent: "#E31F25",
        light: "#F4F7FD",
        dark: "#1A2D52",
        muted: "#66748E",
        background: "#FFFFFF",
        card: "#FFFFFF",
        white: "#FFFFFF",
        blue: {
          50: "#f4f7fd",
          100: "#e7edf8",
          200: "#cbd7ee",
          300: "#a7bcdf",
          400: "#7a97c7",
          500: "#5574ab",
          600: "#3a578e",
          700: "#27447C",
          800: "#1d3460",
          900: "#152544",
        },
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
        },
        red: {
          50: "#fff1f2",
          100: "#ffe0e2",
          200: "#ffc6cb",
          300: "#ff9ba3",
          600: "#E31F25",
        },
      },
      animation: {
        shimmer: "shimmer 2s infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
    },
  },
  plugins: [],
}
