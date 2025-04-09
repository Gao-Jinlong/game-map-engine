import * as THREE from "three";
declare global {
  namespace MapEngine {
    export interface IRendererSystem extends ISystem {
      renderer: THREE.WebGLRenderer;
    }
  }
}
