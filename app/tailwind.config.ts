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
          DEFAULT: '#C22933',
          original: '#D1001F',
          dark: '#BA0019',
        },
        'dark-gray': '#2B2B2B',
        // 'button-color': '#34374B', // Grey version
        // 'button-color': '#15172E', // Blue version
        primary: {
          DEFAULT: '#C0392B' // Fiery red
        },
        secondary: {
          DEFAULT: '#12142D' // Dark navy
        },
        button: {
          DEFAULT: '#EDCFB7' // Creamy sand
        },
        extra: {
          DEFAULT: '#4263AA', // Almosto ultramarine
        },
        red: {
          500: '#FF4545', // Adjust this color to match your design
        }
      },
    },
  },
  plugins: [],
} satisfies Config;