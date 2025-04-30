import { IBaseComponentOptions } from "@core/interfaces";

export interface ILightOptions extends IBaseComponentOptions {
    type: "directional" | "point" | "spot";
    position: THREE.Vector3;
    color: THREE.Color;
    intensity: number;
}
