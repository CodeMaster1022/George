import type { Config } from "tailwindcss";
const { nextui } = require("@nextui-org/theme");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        cat: ["var(--font-cat)"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      screens: {
        'xxs': '380px',
        'xs': '450px',
        'w1450': '1450px',
        'w1080': '1080px',
        'w1200': '1200px',
        'w1300': '1300px',
      },
      animation: {
        "meteor-effect": "meteor 5s linear infinite",
        "wave-bounce": "waveBounce 0.8s ease-in-out",
        "block-jump": "blockJump 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "pulse-slow": "pulseSlow 2s ease-in-out infinite",
      },
      keyframes: {
        meteor: {
          "0%": { transform: "rotate(215deg) translateX(0)", opacity: "1" },
          "70%": { opacity: "1" },
          "100%": {
            transform: "rotate(215deg) translateX(-500px)",
            opacity: "0",
          },
        },
        waveBounce: {
          "0%": { transform: "translateY(0) rotate(0deg) scale(1)" },
          "15%": { transform: "translateY(-20px) rotate(-8deg) scale(1.05)" },
          "30%": { transform: "translateY(-10px) rotate(4deg) scale(1.02)" },
          "45%": { transform: "translateY(-18px) rotate(-6deg) scale(1.08)" },
          "60%": { transform: "translateY(-5px) rotate(3deg) scale(1.03)" },
          "75%": { transform: "translateY(-12px) rotate(-4deg) scale(1.05)" },
          "100%": { transform: "translateY(0) rotate(0deg) scale(1)" },
        },
        blockJump: {
          "0%": { transform: "translateY(0) rotate(0deg) scale(1)" },
          "20%": { transform: "translateY(-30px) rotate(15deg) scale(1.15)" },
          "40%": { transform: "translateY(-40px) rotate(-15deg) scale(1.2)" },
          "60%": { transform: "translateY(-35px) rotate(10deg) scale(1.25)" },
          "80%": { transform: "translateY(-10px) rotate(-5deg) scale(1.1)" },
          "100%": { transform: "translateY(0) rotate(0deg) scale(1)" },
        },
        pulseSlow: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.1)", opacity: "0.8" },
        }
      }
    }
  },
  plugins: [nextui()],
};
export default config;
