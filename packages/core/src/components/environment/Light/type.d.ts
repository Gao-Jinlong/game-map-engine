export interface ILightOptions {
    type: "directional" | "point" | "spot";
    position: THREE.Vector3;
    color: THREE.Color;
    intensity: number;
}
