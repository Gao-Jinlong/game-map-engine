import { resolve } from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {},
    resolve: {
        alias: {
            "@core": resolve(__dirname, "./src"),
        },
    },
});
