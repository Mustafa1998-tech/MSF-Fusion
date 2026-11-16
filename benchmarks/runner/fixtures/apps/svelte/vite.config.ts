import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  base: "./",
  plugins: [svelte()],
  build: {
    target: "es2022",
    minify: "oxc",
    sourcemap: false,
    cssCodeSplit: false,
    reportCompressedSize: false,
  },
});
