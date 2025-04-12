import { Vector3 } from "three";
import * as THREE from "three";
import { ImprovedNoise } from "three/examples/jsm/math/ImprovedNoise";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RendererSystem } from "./RendererSystem";
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

        this.controls.minDistance = 1000;
        this.controls.maxDistance = 10000;
        this.controls.maxPolarAngle = Math.PI / 2;

        this.camera.position.y = this.controls.target.y + 2000;
        this.camera.position.x = 2000;
        this.controls.update();

        this.controls.target.y = 500;
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

function generateHeight(width: number, height: number) {
    const size = width * height,
        data = new Uint8Array(size),
        perlin = new ImprovedNoise(),
        z = Math.random() * 100;

    let quality = 1;

    for (let j = 0; j < 4; j++) {
        for (let i = 0; i < size; i++) {
            const x = i % width,
                y = ~~(i / width);
            data[i] += Math.abs(
                perlin.noise(x / quality, y / quality, z) * quality * 1.75
            );
        }

        quality *= 5;
    }

    return data;
}
