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
export interface MapEvents {
    resize: IMapState;
    click: MouseEventPayload;
}

export interface IEventManager extends EventEmitter<MapEvents> {}
