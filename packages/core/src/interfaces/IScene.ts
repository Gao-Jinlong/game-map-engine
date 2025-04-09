import * as THREE from "three";

declare global {
  namespace MapEngine {
    export interface ISceneSystem extends ISystem {
      scene?: THREE.Scene;
    }
  }
}
