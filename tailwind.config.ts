import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  corePlugins: {
    preflight: false, // Não faz o CSS global reset do Tailwind
  },
  theme: {
    extend: {},
  },
  darkMode: "selector",
  plugins: [
    plugin(function ({ addComponents }) {
      addComponents({
        ".input-base": {
          "--apply":
            "'text-sm w-full shadow p-2 rounded-md bg-white/90 backdrop-blur-sm outline-none ring-2 ring-inset ring-slate-500 ring-opacity-60 focus:ring-opacity-80'",
        },
        ".input-modified": {
          "--apply": "'ring-amber-500 ring-opacity-60'",
        },
        ".input-error": {
          "--apply": "'ring-red-500 ring-opacity-60'",
        },
        ".input-disabled": {
          "--apply": "'pointer-events-none [&>*:not(label)]:opacity-75'",
        },
      });
    }),
  ],
};
export default config;
