import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist/client",
  },
  ssr: {
    noExternal: ["@msf/runtime"],
  },
});
