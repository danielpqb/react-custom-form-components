import { defineConfig } from "tsup";

export const tsup = defineConfig({
  entry: ["src/index.ts"],
  dts: true, // Gerar arquivos de definição de tipo (.d.ts)
  clean: true,
  sourcemap: true,
  format: ["cjs", "esm"],
});
