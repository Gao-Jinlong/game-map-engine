import { SystemManager } from "../systems/SystemManager";

export namespace MapEngine {
    export interface IMap {
        eventManager: any;
        container: HTMLElement;
        options: Required<IMapOptions>;
        state: IMapState;
        systemManager: SystemManager;
    }

    export interface IMapOptions {
        container?: HTMLElement;
        background?: number;
        devicePixelRatio?: number;
    }

    export interface IMapState {
        width: number;
        height: number;
        depth: number;
    }

    export function getContext(): IMap {
        return (window as any).__MAP_ENGINE_CONTEXT__;
    }

    export function setContext(context: IMap) {
        (window as any).__MAP_ENGINE_CONTEXT__ = context;
    }
}
