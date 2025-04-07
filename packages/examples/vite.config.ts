import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "./dist",
  },
  optimizeDeps: {
    exclude: ["@game-map-engine/*"],
  },
  server: {
    port: 3000,
  },
});
