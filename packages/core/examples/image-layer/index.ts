import { Map } from "@core";
import { ImageLayer } from "@core/components";

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
        new ImageLayer({
            src: "/assets/terrain_z1.jpg",
            displacementSrc: "/assets/depth_z1.jpg",
            displacementScale: 700,
            width: 2048,
            height: 2048,
        })
    );

    map.addComponent(
        new ImageLayer({
            src: "/assets/fog.jpg",
            maskSrc: "/assets/fog-mask.jpg",
            width: 1024,
            height: 1024,
            elevation: 1,
        })
    );
}
