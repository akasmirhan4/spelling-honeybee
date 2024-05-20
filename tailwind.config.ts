import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      colors: {
        primary: "rgb(247, 218, 33)",
        grey: "#dcdcdc",
      },
      animation: {
        blink: "blink 1s step-end infinite",
        type: "type 2.5s steps(30, end) infinite",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        type: {
          "0%": { width: "0" },
          "60%": { width: "100%" },
          "100%": { width: "100%" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
