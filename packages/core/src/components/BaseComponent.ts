import {
    IBaseComponentOptions,
    ICameraSystem,
    IMap,
    ISceneSystem,
} from "@core/interfaces";
import { createUniqueId } from "../utils";
import { ComponentId } from "@core/interfaces/IComponentManager";

export abstract class BaseComponent<
    OPTIONS extends IBaseComponentOptions = IBaseComponentOptions
> {
    public readonly __component_id__: ComponentId;
    private _options: OPTIONS;
    public sceneSystem?: ISceneSystem;
    public cameraSystem?: ICameraSystem;
    public context?: IMap;

    constructor(options: OPTIONS) {
        this.__component_id__ = createUniqueId();

        this._options = options;
    }
    get options() {
        return this._options;
    }
    get name() {
        return this._options.name;
    }

    abstract onAdd?(): void;
    abstract onUpdate?(): void;
    abstract onRemove?(): void;
    abstract onResize?(): void;
}
