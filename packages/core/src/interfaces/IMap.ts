import { SystemManager } from "../systems/SystemManager";

declare global {
    namespace MapEngine {
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
        }
        export interface IMapState {
            width: number;
            height: number;
            depth: number;
        }
    }
}
