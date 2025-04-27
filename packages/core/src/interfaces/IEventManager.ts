import EventEmitter from "eventemitter3";
import { IMap, IMapState } from "./IMap";

export type EventPayload = BaseEventPayload | MouseEventPayload;

export interface BaseEventPayload extends MouseEvent {
    context: IMap;
}
export interface MouseEventPayload extends BaseEventPayload {
    lat: number;
    lng: number;
}
export enum MapLifeCycleKey {
    RESIZE = "resize",
    PRE_FRAME = "preFrame",
    POST_FRAME = "postFrame",
    ON_READY = "onReady",
}
export enum MapEventKey {
    MOUSE_DOWN = "mousedown",
    MOUSE_UP = "mouseup",
    MOUSE_MOVE = "mousemove",
    CLICK = "click",
    POINTER_MOVE = "pointermove",
}
export type MapEventKeys = MapLifeCycleKey | MapEventKey;
export interface MapLifeCycle {
    [MapLifeCycleKey.RESIZE]: IMapState;
    [MapLifeCycleKey.PRE_FRAME]: IMap;
    [MapLifeCycleKey.POST_FRAME]: IMap;
    [MapLifeCycleKey.ON_READY]: IMap;
}
export interface MapEvents extends MapLifeCycle {
    [MapEventKey.CLICK]: MouseEventPayload;
    [MapEventKey.POINTER_MOVE]: MouseEventPayload;
}

export interface IEventManager extends EventEmitter<MapEvents> {}
