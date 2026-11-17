import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist/client",
  },
  ssr: {
    noExternal: ["@mustafa-26112026/runtime"],
  },
});
