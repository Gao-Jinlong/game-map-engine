import * as THREE from "three";
import { ISystem } from "./ISystem";

export interface IRendererSystem extends ISystem {
    renderer: THREE.WebGLRenderer;
}
