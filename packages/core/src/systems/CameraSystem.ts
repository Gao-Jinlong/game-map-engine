import { Vector3 } from "three";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RendererSystem } from "./RendererSystem";

/**
 * TODO 封装相机控制器,实现地图的视角控制逻辑
 */
export class CameraSystem implements MapEngine.ICameraSystem {
    public context?: MapEngine.IMap;

    pitch: number = 0;
    roll: number = 0;
    zoom: number = 0;
    position: Vector3 = new Vector3();
    camera?: THREE.PerspectiveCamera;
    private controls?: OrbitControls;
    constructor() {}
    init() {
        if (!this.context) {
            throw new Error("CameraSystem must be initialized with a context");
        }
        const { state, systemManager } = this.context;
        this.camera = new THREE.PerspectiveCamera(
            60,
            state.width / state.height,
            10,
            20000
        );

        const rendererSystem = systemManager.getSystem(RendererSystem);
        this.controls = new OrbitControls(
            this.camera,
            rendererSystem.renderer.domElement
        );

        this.controls.target.set(0, 0, 0);

        // TODO 配置参数化
        this.camera.position.y = this.controls.target.y + 2000;
        this.camera.position.x = 2000;
        this.camera.position.z = 2000;

        // 设置相机控制参数
        this.controls.minPolarAngle = -Math.PI / 4; // 45度
        this.controls.maxPolarAngle = Math.PI / 4; // 90度
        this.controls.minAzimuthAngle = -Math.PI / 4; // -45度
        this.controls.maxAzimuthAngle = Math.PI / 4; // 45度

        // 默认禁用旋转
        // this.controls.enableRotate = false;
        this.controls.enablePan = true;

        // 设置旋转和平移速度
        this.controls.rotateSpeed = 0.5;
        this.controls.panSpeed = 1.0;

        // 监听键盘事件
        const domElement = rendererSystem.renderer.domElement;
        domElement.addEventListener("keydown", this.onKeyDown.bind(this));
        domElement.addEventListener("keyup", this.onKeyUp.bind(this));

        this.controls.update();
    }

    private onKeyDown(event: KeyboardEvent) {
        if (event.key === "Control") {
            this.controls!.enableRotate = true;
        }
    }

    private onKeyUp(event: KeyboardEvent) {
        if (event.key === "Control") {
            this.controls!.enableRotate = false;
        }
    }

    resize(state: MapEngine.IMapState) {
        this.camera!.aspect = state.width / state.height;
        this.camera!.updateProjectionMatrix();
    }
    flyTo(position: Vector3): void {
        this.position.copy(position);
    }
    rollTo(roll: number): void {
        this.roll = roll;
    }
    zoomTo(zoom: number): void {
        this.zoom = zoom;
    }
    update(): void {
        throw new Error("Method not implemented.");
    }
    render(): void {
        throw new Error("Method not implemented.");
    }
}
