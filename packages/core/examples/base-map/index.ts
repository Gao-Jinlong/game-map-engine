import { Map } from "@core";
import { TerrainComponent } from "@core/components";

main();

async function main() {
    const map = new Map({
        container: document.getElementById("map") as HTMLElement,
        background: 0x87ceeb, // 天空蓝背景
        devicePixelRatio: window.devicePixelRatio,
        center: [0, 0, 0],
        zoom: 1,
        pitch: 45,
    });

    map.addComponent(
        new TerrainComponent({
            color: 0xbfd1e5,
            width: 7500,
            height: 7500,
            depth: 100,
        })
    );
}
