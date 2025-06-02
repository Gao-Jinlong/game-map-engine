import { ICameraSystem } from "./ICamera";
import { IMap } from "./IMap";
import { ISceneSystem } from "./IScene";

export type ComponentId = number;

export interface IBaseComponentOptions {
    name?: string;
}

export interface IComponent extends IBaseComponentOptions {
    __component_id__: ComponentId;
    context?: IMap;
    sceneSystem?: ISceneSystem;
    cameraSystem?: ICameraSystem;

    onAdd?(): void;
    onUpdate?(): void;
    onRemove?(): void;
    onResize?(): void;
}
