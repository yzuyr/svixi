import { defineConfig } from "bunup";
import { SveltePlugin } from "bun-plugin-svelte";
import { copy } from "bunup/plugins";

export default defineConfig({
  entry: "src/index.ts",
  outDir: "dist",
  format: "esm",
  dts: true,
  clean: true,
  plugins: [SveltePlugin(), copy(["src/p.svelte"])],
});
