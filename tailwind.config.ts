import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1rem", md: "1.5rem", lg: "2rem" },
      screens: { sm: "640px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1360px" },
    },
    extend: {
      screens: { "3xl": "1440px" },
      colors: {
        // Deep medical navy
        navy: {
          50: "#F2F6FC",
          100: "#E3EBF7",
          200: "#C3D3EC",
          300: "#93AEDA",
          400: "#5E83C1",
          500: "#3B62A6",
          600: "#2A4C8A",
          700: "#1F3B70",
          800: "#152B55",
          900: "#0D1E3F",
          950: "#081430",
        },
        // Healthcare teal / green
        teal: {
          50: "#EDFAF7",
          100: "#D2F2EB",
          200: "#A6E5D8",
          300: "#6DD0BE",
          400: "#35B6A1",
          500: "#169A86",
          600: "#0D7D6D",
          700: "#0C6459",
          800: "#0D5049",
          900: "#0C423D",
        },
        // Strong CTA blue
        brand: {
          50: "#EEF4FF",
          100: "#DAE6FF",
          200: "#BCD2FF",
          500: "#2563EB",
          600: "#1A4FD6",
          700: "#173FAD",
          800: "#18378A",
        },
        surface: "#F5F8FC",
        ink: { DEFAULT: "#0E1B2E", muted: "#4B5B73", subtle: "#5E6B80" },
        line: "#E3E9F2",
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "Manrope", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(2.4rem, 5.2vw, 4.25rem)", { lineHeight: "1.05", letterSpacing: "-0.035em", fontWeight: "750" }],
        "display-lg": ["clamp(2rem, 3.8vw, 3.25rem)", { lineHeight: "1.1", letterSpacing: "-0.03em", fontWeight: "700" }],
        "display-md": ["clamp(1.65rem, 2.6vw, 2.4rem)", { lineHeight: "1.15", letterSpacing: "-0.025em", fontWeight: "700" }],
      },
      boxShadow: {
        card: "0 1px 2px rgba(13,30,63,0.04), 0 4px 16px -4px rgba(13,30,63,0.08)",
        lift: "0 2px 4px rgba(13,30,63,0.04), 0 18px 40px -12px rgba(13,30,63,0.18)",
        glow: "0 0 0 1px rgba(255,255,255,0.08), 0 20px 50px -20px rgba(0,0,0,0.5)",
      },
      borderRadius: { xl: "0.875rem", "2xl": "1.125rem", "3xl": "1.5rem" },
      keyframes: {
        "fade-up": { from: { opacity: "0", transform: "translateY(16px)" }, to: { opacity: "1", transform: "none" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
      },
      animation: {
        "fade-up": "fade-up .7s cubic-bezier(.2,.7,.2,1) both",
        float: "float 7s ease-in-out infinite",
      },
    },
  },
  plugins: [typography],
};

export default config;
