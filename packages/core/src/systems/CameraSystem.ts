import { Vector3 } from "three";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RendererSystem } from "./RendererSystem";

export class CameraSystem implements MapEngine.ICameraSystem {
  pitch: number = 0;
  roll: number = 0;
  zoom: number = 0;
  position: Vector3 = new Vector3();
  camera?: THREE.PerspectiveCamera;
  controls?: OrbitControls;
  context?: MapEngine.IMap;
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
