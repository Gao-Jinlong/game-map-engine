import { createUniqueId } from "../utils";
import { ComponentId } from "@core/interfaces/IComponentManager";
/**
 * TODO: 重新设计组件注册方式,
 * 通过 name 注册, name 可由用户自定义
 * 在调用 add 方法时注入 context 然后执行组件的生命周期
 * 组件内部通过 this.context 访问各个系统,注册监听事件和访问系统的能力
 */
export abstract class BaseComponent<
    OPTIONS extends MapEngine.IBaseComponentOptions
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
