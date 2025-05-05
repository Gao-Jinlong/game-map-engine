import { Vector2 } from "three";
import EventEmitter from "eventemitter3";
import { IMap, IMapState } from "@core/interfaces";

export enum LifeCycleKey {
    RESIZE = "resize",
    PRE_FRAME = "preFrame",
    POST_FRAME = "postFrame",
    ON_READY = "onReady",
}
/**
 * 地图事件
 *
 * 需要注意和 dom 事件区分，这个是地图引擎内部实现的事件，而不是 dom 提供的事件接口
 * 区别在于地图引擎会对事件进行封装，如 pointer 事件可以是 mouse 事件，也可以是 touch 事件,
 * 又如地图引擎可以支持 double click 等高级事件
 */
export enum EventKey {
    CLICK = "click",
    POINTER_MOVE = "pointermove",
    POINTER_DOWN = "pointerdown",
    POINTER_UP = "pointerup",
    DOUBLE_CLICK = "double-click",
    ZOOM_START = "zoom-start",
    ZOOM_END = "zoom-end",
    PITCH_START = "pitch-start",
    PITCH_END = "pitch-end",
    ROLL_START = "roll-start",
    ROLL_END = "roll-end",
}
export type MapEventKeys = LifeCycleKey | EventKey;
/**
 * 事件管理器接口
 */
export interface IEventManager extends EventEmitter<MapEvents> {}

/**
 * 地图生命周期钩子
 */
export interface MapLifeCycle {
    [LifeCycleKey.RESIZE]: IMap;
    [LifeCycleKey.PRE_FRAME]: IMap;
    [LifeCycleKey.POST_FRAME]: IMap;
    [LifeCycleKey.ON_READY]: IMap;
}
export interface MapEvents extends MapLifeCycle {
    [EventKey.CLICK]: IPointerEvent;
    [EventKey.POINTER_MOVE]: IPointerEvent;
    [key: string]: any;
}

/**
 * 事件基类
 * 所有事件都继承自此基类
 */
export interface IBaseEvent {
    type: string;
}
/**
 * 指针事件
 */
export interface IPointerEvent extends IBaseEvent {
    type:
        | EventKey.POINTER_DOWN
        | EventKey.POINTER_MOVE
        | EventKey.POINTER_UP
        | EventKey.CLICK;
    pointer: Vector2;
}
