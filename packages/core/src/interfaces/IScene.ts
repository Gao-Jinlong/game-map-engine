import * as THREE from "three";
import { ISystem } from "./ISystem";

export interface ISceneSystem extends ISystem {
    scene?: THREE.Scene;
}
