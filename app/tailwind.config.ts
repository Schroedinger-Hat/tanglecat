import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'primary-red': {
          DEFAULT: '#D1001F',
          dark: '#BA0019',
        },
        'dark-gray': '#2B2B2B',
        red: {
          500: '#FF4545', // Adjust this color to match your design
        }
      },
    },
  },
  plugins: [],
} satisfies Config;
