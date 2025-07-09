import type { Config } from "tailwindcss"

export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
        button: "var(--button)",
        text: "var(--text)",
        ondark: "var(--ondark)",
        onlight: "var(--onlight)",
      },
    },
  },
  plugins: [],
} satisfies Config