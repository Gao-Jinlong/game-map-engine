import { SystemManager } from "../systems/SystemManager";

declare global {
    namespace MapEngine {
        export type Coord = [number, number, number];
        export interface IMap {
            eventManager: IEventManager;
            systemManager: SystemManager;

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
        }
        export interface IMapState {
            width: number;
            height: number;
            depth: number;
        }
    }
}
