import { IMap, ISceneSystem } from "@core/interfaces";
import * as THREE from "three";

export class SceneSystem implements ISceneSystem {
    scene: THREE.Scene;
    context?: IMap;
    constructor() {
        this.scene = new THREE.Scene();
    }

    init() {
        if (!this.context) {
            throw new Error("SceneSystem must be initialized with a context");
        }
        const { options } = this.context;
        this.scene.background = new THREE.Color(options.background);

        this.createEnvironmentLight();

        if (process.env.NODE_ENV === "development") {
            this.addTestObject();
        }
    }

    // 创建环境光照
    createEnvironmentLight() {
        const environmentLight = new THREE.DirectionalLight(0xffffff, 2.5);
        environmentLight.position.set(0, 2000, 0);
        this.scene.add(environmentLight);
    }

    private addTestObject() {
        const marker = new THREE.Mesh(
            new THREE.BoxGeometry(100, 100, 100),
            new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
        );

        marker.position.set(1000, 0, 0);

        this.scene.add(marker);
    }

    destroy() {
        this.scene.clear();
    }
}
