import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        "ecs-demo": resolve(__dirname, "ecs-demo/index.html"),
        "base-project": resolve(__dirname, "base-project/index.html"),
      },
    },
  },
  optimizeDeps: {
    exclude: ["@game-map-engine/*"],
  },
  server: {
    port: 3000,
  },
});
