import EventEmitter from "eventemitter3";
import { IMapState } from "./IMap";

export interface MapEvents {
    resize: IMapState;
}
export interface IEventManager extends EventEmitter<MapEvents> {}
