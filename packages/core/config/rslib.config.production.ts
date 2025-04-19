import { defineConfig } from "@rslib/core";
import path from "path";

const root = path.resolve(__dirname, "../");

export default defineConfig({
    lib: [
        {
            format: "esm",
            dts: true,
            output: {
                distPath: {
                    root: `${root}/dist`,
                },
            },
        },
        {
            format: "cjs",
            dts: true,
            output: {
                distPath: {
                    root: `${root}/dist/cjs`,
                },
            },
        },
    ],
    output: {
        target: "web",
        cleanDistPath: true,
    },
    plugins: [],
});
