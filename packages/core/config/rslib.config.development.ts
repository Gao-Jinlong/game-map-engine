import { defineConfig } from "@rslib/core";
import path, { resolve } from "path";

const root = path.resolve(__dirname, "../");
const src = path.resolve(__dirname, "../src");

export default defineConfig({
    lib: [
        {
            format: "esm",
            bundle: true,
            dts: true,
            output: {
                distPath: {
                    root: resolve(root, "dist/esm"),
                },
            },
        },
        {
            format: "cjs",
            bundle: true,
            dts: true,
            output: {
                distPath: {
                    root: resolve(root, "dist/cjs"),
                },
            },
        },
    ],
    output: {
        target: "web",
        cleanDistPath: true,
        sourceMap: true,
    },
    source: {
        entry: {
            index: resolve(src, "index.ts"),
            layers: resolve(src, "layers.ts"),
            events: resolve(src, "events.ts"),
            project: resolve(src, "project.ts"),
        },
    },
    plugins: [],
});
