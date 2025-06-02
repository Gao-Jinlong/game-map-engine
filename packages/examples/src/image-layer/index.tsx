import React, { useEffect, useRef } from "react";
import { Map } from "@gme/core";
import { ImageLayer } from "@gme/core/layers";
import { PointerEventTypeEnum } from "@core/events";
import { Marker } from "@core/marker";
import { Howl } from "howler";

const audio = new Howl({
    src: ["/assets/audio/sfx-ui-hover-regions-01.mp3"],
});

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
                    hoverIconUrl: "/assets/demacia-hover.png", // 悬停时的纹理
                    size: 200,
                    hoverSize: 240, // 悬停时的大小
                    color: 0xff0000,
                    hoverColor: 0x00ff00, // 悬停时的颜色
                    opacity: 1.0,
                    hoverOpacity: 0.9, // 悬停时的透明度
                    animationDuration: 400, // 动画持续时间
                    animationEasing: "easeInOut", // 动画缓动函数
                    onClick: (marker) => {
                        console.log(
                            "Marker 被点击了！位置:",
                            marker.getPosition(),
                        );
                    },
                    onHover: (marker, isHovering) => {
                        if (isHovering) {
                            console.log("鼠标悬停在 Marker 上");
                            audio.play();
                            // 现在悬停效果由内置动画系统处理，不需要手动设置
                        } else {
                            console.log("鼠标离开 Marker");
                            // 离开效果也由内置动画系统处理
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
