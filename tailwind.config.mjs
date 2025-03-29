import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#f9b72d",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        grayDark: "#1a1a1a",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        meteor: {
          "0%": { 
            transform: "rotate(215deg) translateX(0)",
            opacity: 1 
          },
          "70%": { opacity: 1 },
          "100%": {
            transform: "rotate(215deg) translateX(-500px)",
            opacity: 0
          },
        },
        spotlight: {
          "0%": {
            opacity: 0,
            transform: "translate(-72%, -62%) scale(0.5)",
          },
          "100%": {
            opacity: 1,
            transform: "translate(-50%, -40%) scale(1)",
          },
        },
        shimmer: {
          from: { backgroundPosition: "0 0" },
          to: { backgroundPosition: "-200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0) translateX(0) rotate(0deg)" },
          "25%": { transform: "translateY(-5px) translateX(5px) rotate(2deg)" },
          "50%": { transform: "translateY(-10px) translateX(0) rotate(0deg)" },
          "75%": { transform: "translateY(-5px) translateX(-5px) rotate(-2deg)" },
        },
        "bee-float": {
          "0%": { transform: "translateY(0) translateX(0) rotate(0deg)" },
          "10%": { transform: "translateY(-20px) translateX(15px) rotate(4deg)" },
          "30%": { transform: "translateY(-35px) translateX(20px) rotate(7deg)" },
          "50%": { transform: "translateY(-20px) translateX(0) rotate(0deg)" },
          "70%": { transform: "translateY(-35px) translateX(-20px) rotate(-7deg)" },
          "90%": { transform: "translateY(-20px) translateX(-15px) rotate(-4deg)" },
          "100%": { transform: "translateY(0) translateX(0) rotate(0deg)" },
        },
        "fade-in-down": {
          from: {
            opacity: 0,
            transform: "translateY(-20px)",
          },
          to: {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
        "pulse-custom": {
          "0%, 100%": {
            opacity: 1,
          },
          "50%": {
            opacity: 0.5,
          },
        },
        "shimmer-custom": {
          "0%": {
            backgroundPosition: "-200% 0",
          },
          "100%": {
            backgroundPosition: "200% 0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "meteor-effect": "meteor 5s linear infinite",
        spotlight: "spotlight 2s ease .75s 1 forwards",
        shimmer: "shimmer 2s linear infinite",
        float: "float 6s ease-in-out infinite",
        "bee-float": "bee-float 8s ease-in-out infinite",
        "fade-in-down": "fade-in-down 0.5s ease-out",
        "pulse-custom": "pulse-custom 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer-custom": "shimmer-custom 2s infinite",
      },
      perspective: {
        1000: "1000px",
        2000: "2000px",
      },
      transformStyle: {
        "3d": "preserve-3d",
      },
      backfaceVisibility: {
        hidden: "hidden",
      },
    },
  },
  plugins: [
    animate,
    function ({ addUtilities }) {
      addUtilities({
        ".perspective-1000": {
          perspective: "1000px",
        },
        ".perspective-2000": {
          perspective: "2000px",
        },
        ".preserve-3d": {
          transformStyle: "preserve-3d",
        },
        ".backface-hidden": {
          backfaceVisibility: "hidden",
        },
      });
    },
  ],
};

export default config; 