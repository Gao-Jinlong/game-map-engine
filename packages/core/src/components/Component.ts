import * as THREE from "three";
import { SceneSystem } from "../systems/SceneSystem";
import { MapEngine } from "../types";

export abstract class Component {
    protected scene: THREE.Scene;
    protected context: MapEngine.IMap;

    constructor() {
        this.context = MapEngine.getContext();
        const sceneSystem = this.context.systemManager.getSystem(SceneSystem);
        this.scene = sceneSystem.scene;
    }

    abstract init(): void;
    abstract update(): void;
    abstract destroy(): void;
}
