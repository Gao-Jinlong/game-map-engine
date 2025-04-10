import EventEmitter from "eventemitter3";

declare global {
    namespace MapEngine {
        export interface MapEvents {
            resize: MapEngine.IMapState;
        }
        export interface IEventManager extends EventEmitter<MapEvents> {}
    }
}
