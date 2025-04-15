import { createUniqueId } from "../utils";
import { ComponentId } from "@core/interfaces/IComponentManager";

export abstract class BaseComponent<
    OPTIONS extends MapEngine.IBaseComponentOptions = MapEngine.IBaseComponentOptions
> {
    public readonly __component_id__: ComponentId;
    private _options: OPTIONS;
    public sceneSystem?: MapEngine.ISceneSystem;
    public cameraSystem?: MapEngine.ICameraSystem;
    public context?: MapEngine.IMap;

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
