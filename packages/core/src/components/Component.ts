import * as THREE from "three";
import { MapEngine } from "../types";
import { createUniqueId } from "../utils";
import { ComponentId } from "@core/interfaces/IComponentManager";

/**
 * TODO: 重新设计组件注册方式,
 * 通过 name 注册, name 可由用户自定义
 * 在调用 add 方法时实例化类并注入 context 然后执行组件的生命周期
 * 组件内部通过 this.context 访问各个系统,注册监听事件和访问系统的能力
 */
export abstract class Component {
    public readonly __component_id__: ComponentId;
    public scene?: THREE.Scene;
    public context?: MapEngine.IMap;

    constructor() {
        this.__component_id__ = createUniqueId();
    }

    abstract init(): void;
    abstract update(): void;
    abstract destroy(): void;
}
