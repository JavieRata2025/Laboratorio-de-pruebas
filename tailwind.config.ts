import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#F0F9FF",
        primary: "#FF6B35",
        secondary: "#4CC9F0",
        accent: "#FFD166",
        ink: "#1E293B",
      },
      fontFamily: {
        sans: ['"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'brutal': '4px 4px 0 #1E293B',
        'brutal-robot': '6px 6px 0 #4CC9F0',
        'brutal-user': '-6px 6px 0 #FF6B35',
        'brutal-sidebar': '8px 0 0 rgba(0,0,0,0.05)',
      }
    },
  },
  plugins: [],
} satisfies Config;
