import { IEventCapture, IInteraction } from "@core/systems/intercation";
import { SystemManager } from "../systems/SystemManager";
import {
    IBounds,
    IBoundsTuple,
    ICoord,
    ICoordTuple,
    IPosition,
    IPositionTuple,
} from "./ICoord";
import { ICrsSystem } from "./ICrsSystem";
import { EventTarget } from "@core/components/events/EventTarget";
import { IPointerEvent } from "@core/components/events/types";
import { Point } from "@core/entity/Point";
import { Coord } from "@core/entity";
import { Plane } from "three";

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
     * 引擎性能监控
     */
    stats: Stats;
    container: HTMLElement;
    /**
     * 海平面
     */
    readonly seaLevel: Plane;
    options: Required<IMapOptions>;
    bounds: IBounds;
    state: IMapState;
    project(coord: ICoordTuple | ICoord, zoom: number): IPosition;
    unproject(position: Point): Coord;
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
