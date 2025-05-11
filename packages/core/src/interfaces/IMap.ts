import { IEventDispatcher } from "@core/systems/Intercation";
import { SystemManager } from "../systems/SystemManager";
import { ICoord, ICoordTuple } from "./ICoord";
import { ICrsSystem } from "./ICrsSystem";
import { EventTarget } from "@core/components/events/EventTarget";

export interface IMap extends EventTarget {
    crsSystem: ICrsSystem;
    eventManager: IEventDispatcher;
    systemManager: SystemManager;
    // stateService: IStateService;
    /**
     * 地图状态
     */
    stats: Stats;
    container: HTMLElement;
    options: Required<IMapOptions>;
    state: IMapState;
}
export interface IMapOptions {
    container?: HTMLElement;
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
