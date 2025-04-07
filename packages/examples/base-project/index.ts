import { MapEngine } from "@game-map-engine/core";
import * as THREE from "three";
import "./style.css";

// 创建容器
const container = document.createElement("div");
container.style.width = "100%";
container.style.height = "100%";
document.body.appendChild(container);

// 初始化地图引擎
const mapEngine = new MapEngine(container);

// 添加一个测试立方体
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(0, 0.5, 0);
cube.castShadow = true;
mapEngine.addObject(cube);

// 开始动画循环
mapEngine.animate();

console.log("base project");
