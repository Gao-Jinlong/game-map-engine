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

export abstract class BaseComponent<
        OPTIONS extends IBaseComponentOptions = IBaseComponentOptions
    >
    extends EventTarget
    implements IComponent<OPTIONS>
{
    public readonly __component_id__: ComponentId;
    protected _options: OPTIONS | undefined;
    public sceneSystem?: ISceneSystem;
    public cameraSystem?: ICameraSystem;
    public context?: IMap;

    constructor() {
        super();
        this.__component_id__ = createUniqueId();
    }
    get options() {
        return this._options;
    }
    get name() {
        return this._options?.name;
    }

    abstract onAdd?(): void;
    abstract onUpdate?(): void;
    abstract onRemove?(): void;
    abstract onResize?(): void;
}
