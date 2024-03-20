import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      backgroundColor:{
        "Almost-White":"#FCFCFC",
        "Amber-Orange":"#FCF6E1",
        "Gray-linear":"#F5F4F5",
        "MIC":"#7863F3",
        "Amber":"#ffbd9c"
      },
      textColor:{
        "Ind":"#7863f3",
        "Gray":"#c0c0c0",
        "Ind-Dark":"#00529b",
        "Pri-Dark":"#17191C"
      },
      borderColor:{
        "Ind":"#7863f3",
        "Ind-Dark":"#00529b"
      }
    },
  },
  plugins: [],
};
export default config;
