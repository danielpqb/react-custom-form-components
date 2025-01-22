import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  corePlugins: {
    preflight: false, // Não faz o CSS global reset do Tailwind
  },
  theme: {
    extend: {},
  },
  darkMode: "selector",
  plugins: [],
};
export default config;
