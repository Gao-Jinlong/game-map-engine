import { Map } from "@core";

main();

async function main() {
    const map = new Map({
        container: document.getElementById("map") as HTMLElement,
        background: 0x87ceeb, // 天空蓝背景
        devicePixelRatio: window.devicePixelRatio,
    });
}
