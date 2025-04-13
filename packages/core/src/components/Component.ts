import * as THREE from "three";
import { MapEngine } from "../types";
import { createUniqueId } from "../utils";
export abstract class Component {
    public readonly __component_id__: string;
    public scene?: THREE.Scene;
    public context?: MapEngine.IMap;

    constructor() {
        this.__component_id__ = createUniqueId();
    }

    abstract init(): void;
    abstract update(): void;
    abstract destroy(): void;
}
