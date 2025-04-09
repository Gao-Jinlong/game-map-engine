import * as THREE from "three";

export class SceneSystem implements MapEngine.ISceneSystem {
  scene: THREE.Scene;
  context?: MapEngine.IMap;
  constructor() {
    this.scene = new THREE.Scene();
  }

  init() {
    if (!this.context) {
      throw new Error("SceneSystem must be initialized with a context");
    }
    const { options } = this.context;
    this.scene.background = new THREE.Color(options.background);
  }
}
