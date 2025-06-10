import { IEventTarget } from "@core/events";
import { ICameraSystem } from "./ICamera";
import { IMap } from "./IMap";
import { ISceneSystem } from "./IScene";

export type ComponentId = number;

export interface IBaseComponentOptions {
    name?: string;
}

export interface IComponent extends IBaseComponentOptions, IEventTarget {
    __component_id__: ComponentId;
    context?: IMap;
    sceneSystem?: ISceneSystem;
    cameraSystem?: ICameraSystem;

    onAdd?(): void;
    onUpdate?(time: number, frame: XRFrame): void;
    onRemove?(): void;
    onResize?(): void;
}
