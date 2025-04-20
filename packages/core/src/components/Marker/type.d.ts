import { IBaseComponentOptions } from "@core/interfaces";

export interface IMarkerOptions extends IBaseComponentOptions {
    position: THREE.Vector3;
    rotation: THREE.Vector3;
    scale: THREE.Vector3;
}
