import { IEventCapture, IInteraction } from "@core/systems/Intercation";
import { SystemManager } from "../systems/SystemManager";
import { IBounds, IBoundsTuple, ICoord, ICoordTuple } from "./ICoord";
import { ICrsSystem } from "./ICrsSystem";
import { EventTarget } from "@core/components/events/EventTarget";

export interface IMap extends EventTarget {
    crsSystem: ICrsSystem;
    /**
     * 事件捕获 Service
     */
    eventCaptureService: IEventCapture;
    /**
     * pointer 交互 Service
     */
    interactionService: IInteraction;

    /**
     * 系统管理器
     */
    systemManager: SystemManager;

    // stateService: IStateService;
    /**
     * 地图状态
     */
    stats: Stats;
    container: HTMLElement;
    options: Required<IMapOptions>;
    bounds: IBounds;
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
    bounds?: IBoundsTuple;
}

export interface IMapState {
    width: number;
    height: number;
}
