import { IEventTarget } from "@core/events";
import { ICameraSystem } from "./ICamera";
import { IMap } from "./IMap";
import { ISceneSystem } from "./IScene";

export type ComponentId = number;

export interface IBaseComponentOptions {
    name?: string;
}

export interface IComponent<
    OPTIONS extends IBaseComponentOptions = IBaseComponentOptions
> extends IBaseComponentOptions,
        IEventTarget {
    __component_id__: ComponentId;
    context?: IMap;
    sceneSystem?: ISceneSystem;
    cameraSystem?: ICameraSystem;
    options: OPTIONS;

    onAdd?(): void;
    onUpdate?(): void;
    onRemove?(): void;
    onResize?(): void;
}
