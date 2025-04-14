import { Vector3 } from "three";

declare global {
    export namespace MapEngine {
        export interface ICameraSystem extends ISystem {
            pitch: number;
            roll: number;
            zoom: number;
            position: Vector3;
            camera?: THREE.Camera;

            flyTo(position: Vector3): void;
            rollTo(roll: number): void;
            zoomTo(zoom: number): void;
            update(): void;
            render(): void;
        }
    }
}
