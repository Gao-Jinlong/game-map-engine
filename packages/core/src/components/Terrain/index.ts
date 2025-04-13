import * as THREE from "three";
import { Component } from "../Component";

export class TerrainComponent extends Component {
    geometry: THREE.PlaneGeometry;
    constructor() {
        super();
    }
    init(): void {
        const { state } = this.context;
        this.geometry = new THREE.PlaneGeometry(
            state.width,
            state.height,
            100,
            100
        );

        const material = new THREE.MeshBasicMaterial({
            color: 0x000000,
        });

        const mesh = new THREE.Mesh(this.geometry, material);
        this.scene?.add(mesh);
    }
    update(): void {
        throw new Error("Method not implemented.");
    }
    destroy(): void {
        throw new Error("Method not implemented.");
    }
}
