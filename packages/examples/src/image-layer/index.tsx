import React, { useEffect, useRef } from "react";
import { Map } from "gme";
import { ImageLayer } from "gme/layers";

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
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.destroy();
                mapRef.current = null;
            }
        };
    }, []);

    return <div className="map-container" ref={containerRef} />;
};

export default ImageLayerExample;
