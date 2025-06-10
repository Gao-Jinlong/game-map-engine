import {
    ComponentId,
    IBaseComponentOptions,
    ICameraSystem,
    IComponent,
    IMap,
    ISceneSystem,
} from "@core/interfaces";
import { createUniqueId } from "../utils";
import { EventTarget } from "@core/events";

export abstract class BaseComponent extends EventTarget implements IComponent {
    public readonly __component_id__: ComponentId;
    public sceneSystem?: ISceneSystem;
    public cameraSystem?: ICameraSystem;
    public context?: IMap;

    constructor() {
        super();
        this.__component_id__ = createUniqueId();
    }

    abstract onAdd?(): void;
    abstract onUpdate?(): void;
    abstract onRemove?(): void;
    abstract onResize?(): void;
}
