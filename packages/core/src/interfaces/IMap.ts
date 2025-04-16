import { SystemManager } from "../systems/SystemManager";

/**
 * TODO 重构类型定义方式，通过 model 和 export 的方式，避免全局作用域
 */
declare global {
    namespace MapEngine {
        export type Coord = [number, number, number];
        export interface IMap {
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
            center?: Coord;
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
    }
}
