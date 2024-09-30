import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      rotate: {
        "-60": "-60deg",
        "-58": "-58deg",
        "-46": "-46deg",
        "-45": "-45deg",
        "-36": "-36deg",
        "-30": "-30deg",
        "-24": "-24deg",
        "-15": "-15deg",
        "-12": "-12deg",
      },
    },
  },

  plugins: [tailwindAnimate, typography],
};
export default config;
