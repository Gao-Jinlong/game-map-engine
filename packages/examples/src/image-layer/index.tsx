import React, { useEffect, useRef } from "react";
import { Map } from "@gme/core";
import { ImageLayer } from "@gme/core/layers";
import { PointerEventTypeEnum } from "@core/events";
import { Marker } from "@core/marker";

const ImageLayerExample: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<Map>(null);

    useEffect(() => {
        if (containerRef.current && !mapRef.current) {
            // 初始化地图引擎
            mapRef.current = new Map({
                container: containerRef.current,
                center: [116.404, 39.915, 0],
                zoom: 11,
                background: 0x87ceeb, // 天空蓝背景
            });

            mapRef.current.addComponent(
                new ImageLayer({
                    src: "/assets/terrain_z1.jpg",
                    displacementSrc: "/assets/depth_z1.jpg",
                    displacementScale: 700,
                }),
            );

            mapRef.current.addComponent(
                // TODO 类型 fix
                new Marker({
                    position: [0, 100, 0],
                    iconUrl: "/assets/demacia.png",
                    size: 200,
                    color: 0xff0000,
                    onClick: (marker) => {
                        console.log(
                            "Marker 被点击了！位置:",
                            marker.getPosition(),
                        );

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
                }),
            );

            mapRef.current.addEventListener(
                PointerEventTypeEnum.DOUBLE_TAP,
                (event) => {
                    console.log("🚀 ~ mapRef.current.on ~ event:", event);
                },
            );
            mapRef.current.addEventListener(
                PointerEventTypeEnum.TAP,
                (event) => {
                    console.log("🚀 ~ mapRef.current.on ~ event:", event);
                },
            );
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.dispose();
                mapRef.current = null;
                containerRef.current = null;
            }
        };
    }, []);

    return <div className="map-container" ref={containerRef} />;
};

export default ImageLayerExample;
