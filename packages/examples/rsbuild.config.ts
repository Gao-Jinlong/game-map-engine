import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginSass } from "@rsbuild/plugin-sass";
import { pluginSourceBuild } from "@rsbuild/plugin-source-build";
// 等待 core 构建完成
await new Promise((resolve) => {
    setTimeout(() => {
        resolve(true);
    }, 1000);
});
export default defineConfig({
    plugins: [pluginReact(), pluginSass(), pluginSourceBuild()],
    server: {
        port: 3000,
        open: true,
    },
    dev: {},
    // tools: {
    //     rspack: {
    //         watchOptions: {
    //             ignored: /\.git/,
    //         },
    //     },
    // },
});
