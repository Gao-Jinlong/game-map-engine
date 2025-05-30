import { Marker } from "./Marker";
import { Map } from "../../Map";
import * as THREE from "three";

/**
 * Marker 点击事件使用示例
 */

// 创建带点击事件的 Marker
export function createClickableMarker(map: Map) {
    const marker = new Marker({
        position: [100, 0, 100],
        size: 2,
        color: 0xff0000,
        interactive: true,
        onClick: (marker) => {
            console.log("Marker 被点击了！位置:", marker.getPosition());

            // 点击时改变颜色和大小（示例效果）
            marker.setScale(new THREE.Vector3(1.5, 1.5, 1.5));

            // 500ms 后恢复原始大小
            setTimeout(() => {
                marker.setScale(new THREE.Vector3(1, 1, 1));
            }, 500);
        },
        onHover: (marker, isHovering) => {
            if (isHovering) {
                console.log("鼠标悬停在 Marker 上");
                marker.setOpacity(0.7);
            } else {
                console.log("鼠标离开 Marker");
                marker.setOpacity(1.0);
            }
        },
    });

    // 添加到地图
    map.add(marker);

    return marker;
}

// 创建多个可交互的 Marker
export function createMultipleClickableMarkers(map: Map) {
    const markers: Marker[] = [];

    for (let i = 0; i < 5; i++) {
        const marker = new Marker({
            position: [i * 50, 0, 0],
            size: 1.5,
            color: 0x00ff00 + i * 0x001100, // 渐变绿色
            interactive: true,
            name: `marker_${i}`,
            onClick: (clickedMarker) => {
                console.log(`第 ${i + 1} 个 Marker 被点击了！`);

                // 点击时让所有其他 Marker 变半透明
                markers.forEach((otherMarker) => {
                    if (otherMarker !== clickedMarker) {
                        otherMarker.setOpacity(0.3);
                    }
                });

                // 2秒后恢复所有 Marker 的透明度
                setTimeout(() => {
                    markers.forEach((marker) => {
                        marker.setOpacity(1.0);
                    });
                }, 2000);
            },
            onHover: (marker, isHovering) => {
                if (isHovering) {
                    marker.setScale(new THREE.Vector3(1.2, 1.2, 1.2));
                } else {
                    marker.setScale(new THREE.Vector3(1, 1, 1));
                }
            },
        });

        markers.push(marker);
        map.add(marker);
    }

    return markers;
}

// 创建带图标的可点击 Marker
export function createIconClickableMarker(map: Map, iconUrl: string) {
    const marker = new Marker({
        position: [0, 10, 0],
        iconUrl: iconUrl,
        size: 3,
        interactive: true,
        billboard: true,
        onClick: (marker) => {
            console.log("图标 Marker 被点击了！");

            // 创建一个旋转动画
            let rotation = 0;
            const animate = () => {
                rotation += 0.1;
                if (rotation < Math.PI * 2) {
                    // 注意：billboard 模式下旋转无效，这里仅作演示
                    // 实际使用中可以改变大小或透明度
                    marker.setScale(
                        new THREE.Vector3(
                            1 + Math.sin(rotation) * 0.5,
                            1 + Math.sin(rotation) * 0.5,
                            1
                        )
                    );
                    requestAnimationFrame(animate);
                } else {
                    marker.setScale(new THREE.Vector3(1, 1, 1));
                }
            };
            animate();
        },
        onHover: (marker, isHovering) => {
            if (isHovering) {
                marker.setOpacity(0.8);
            } else {
                marker.setOpacity(1.0);
            }
        },
    });

    map.add(marker);
    return marker;
}

// 使用示例
export function initMarkerClickExample(map: Map) {
    // 创建单个可点击 Marker
    const singleMarker = createClickableMarker(map);

    // 创建多个可点击 Marker
    const multipleMarkers = createMultipleClickableMarkers(map);

    // 如果有图标 URL，创建图标 Marker
    // const iconMarker = createIconClickableMarker(map, '/path/to/icon.png');

    console.log("Marker 点击事件示例已初始化");
    console.log("- 单击任何红色或绿色的标记来触发点击事件");
    console.log("- 将鼠标悬停在标记上查看悬停效果");

    return {
        singleMarker,
        multipleMarkers,
        // iconMarker
    };
}
