import { Marker } from "./index";
import * as THREE from "three";

/**
 * Marker 使用示例
 *
 * 这个文件展示了如何在地图引擎中使用 Marker 组件
 */

// 示例1：创建一个简单的红色标记
export function createBasicMarker() {
    const basicMarker = new Marker({
        position: [0, 0, 0],
        size: 2,
        color: 0xff0000,
        interactive: true,
        onClick: (marker) => {
            console.log("基础标记被点击了！", marker.getPosition());
        },
    });

    return basicMarker;
}

// 示例2：创建带自定义图标的标记
export function createIconMarker(iconUrl: string) {
    const iconMarker = new Marker({
        position: [100, 0, 100],
        iconUrl: iconUrl,
        size: 3,
        opacity: 0.9,
        billboard: true,
        interactive: true,
        onClick: (marker) => {
            console.log("图标标记被点击了！");
            // 点击时闪烁效果
            marker.setOpacity(0.3);
            setTimeout(() => marker.setOpacity(0.9), 200);
        },
        onHover: (marker, isHovering) => {
            if (isHovering) {
                // 悬停时放大
                marker.setScale(new THREE.Vector3(1.2, 1.2, 1.2));
            } else {
                // 离开时恢复
                marker.setScale(new THREE.Vector3(1, 1, 1));
            }
        },
    });

    return iconMarker;
}

// 示例3：创建非看板模式的固定方向标记
export function createFixedMarker() {
    const fixedMarker = new Marker({
        position: [-50, 0, 50],
        rotation: [0, Math.PI / 4, 0], // 45度旋转
        size: 1.5,
        color: 0x00ff00,
        billboard: false, // 不面向相机
        interactive: true,
        opacity: 0.8,
    });

    return fixedMarker;
}

// 示例4：创建可动画的标记
export function createAnimatedMarker() {
    const animatedMarker = new Marker({
        position: [0, 0, 200],
        size: 2,
        color: 0x0088ff,
        interactive: true,
    });

    // 添加上下浮动动画
    let time = 0;
    const originalY = animatedMarker.getPosition().y;

    const animate = () => {
        time += 0.02;
        const newPosition = animatedMarker.getPosition();
        newPosition.y = originalY + Math.sin(time) * 5;
        animatedMarker.setPosition(newPosition);

        requestAnimationFrame(animate);
    };

    animate();

    return animatedMarker;
}

// 示例5：创建一组标记形成图案
export function createMarkerPattern() {
    const markers: Marker[] = [];
    const radius = 50;
    const count = 8;

    for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        const marker = new Marker({
            position: [x, 0, z],
            size: 1 + i * 0.2, // 递增大小
            color: 0xff00ff,
            interactive: true,
            onClick: (marker) => {
                console.log(`圆形图案中的第${i + 1}个标记被点击了！`);
                // 点击时改变颜色
                const colors = [
                    0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff,
                ];
                const randomColor =
                    colors[Math.floor(Math.random() * colors.length)];
                // 注意：这里需要重新创建材质来改变颜色，实际使用中可能需要更复杂的实现
            },
        });

        markers.push(marker);
    }

    return markers;
}

// 示例6：性能优化示例 - 批量创建标记
export function createMarkerBatch(count: number = 100) {
    const markers: Marker[] = [];

    for (let i = 0; i < count; i++) {
        // 在一个区域内随机分布标记
        const x = (Math.random() - 0.5) * 500;
        const z = (Math.random() - 0.5) * 500;

        const marker = new Marker({
            position: [x, 0, z],
            size: 0.5 + Math.random() * 1,
            color: Math.random() * 0xffffff,
            interactive: i % 10 === 0, // 只有每第10个标记可交互，减少性能开销
            opacity: 0.7,
        });

        markers.push(marker);
    }

    return markers;
}

// 工具函数：将所有标记添加到地图
export function addMarkersToMap(map: any, markers: Marker | Marker[]) {
    const markerArray = Array.isArray(markers) ? markers : [markers];

    markerArray.forEach((marker) => {
        map.add(marker);
    });

    return markerArray;
}

// 工具函数：从地图移除所有标记
export function removeMarkersFromMap(map: any, markers: Marker | Marker[]) {
    const markerArray = Array.isArray(markers) ? markers : [markers];

    markerArray.forEach((marker) => {
        map.remove(marker);
    });
}
