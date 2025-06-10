import { toDefaulted } from "es-toolkit/compat";
import { BaseComponent } from "../../BaseComponent";
import { ILightOptions } from "./type";
import * as THREE from "three";

export class Light extends BaseComponent {
    #options: ILightOptions;
    onAdd?(): void {
        throw new Error("Method not implemented.");
    }
    onUpdate?(): void {
        throw new Error("Method not implemented.");
    }
    onRemove?(): void {
        throw new Error("Method not implemented.");
    }
    onResize?(): void {
        throw new Error("Method not implemented.");
    }
    constructor(options: Partial<ILightOptions>) {
        super();
        const finalOptions = toDefaulted(options, {
            type: "directional",
            position: new THREE.Vector3(),
            color: new THREE.Color(),
            intensity: 1,
        });

        this.#options = finalOptions;
    }
}
