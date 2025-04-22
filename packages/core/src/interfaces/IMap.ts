import { SystemManager } from "../systems/SystemManager";
import { ICoord, ICoordTuple } from "./ICoord";
import { ICrsSystem } from "./ICrsSystem";
import { IEventManager } from "./IEventManager";

/**
 * TODO 重构类型定义方式，通过 model 和 export 的方式，避免全局作用域
 */
export interface IMap {
    crsSystem: ICrsSystem;
    eventManager: IEventManager;
    systemManager: SystemManager;
    stats: Stats;
    container: HTMLElement;
    options: Required<IMapOptions>;
    state: IMapState;
}
export interface IMapOptions {
    container: HTMLElement;
    background?: number;
    devicePixelRatio?: number;
    center?: ICoordTuple;
    zoom?: number;
    pitch?: number;
    roll?: number;
    world?: IMapWorld;
}
export interface IMapWorld {
    width: number;
    height: number;
    depth: number;
}
export interface IMapState {
    width: number;
    height: number;
    depth: number;
}
