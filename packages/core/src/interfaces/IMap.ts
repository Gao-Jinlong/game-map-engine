import { SystemManager } from "../systems/SystemManager";
import { IEventManager } from "./IEventManager";

declare global {
  namespace MapEngine {
    export interface IMap {
      eventManager: IEventManager;
      systemManager: SystemManager;

      container: HTMLElement;
      options: IMapOptions;
      state: IMapState;
    }
    export interface IMapOptions {
      container: HTMLElement;
      background: number;
      devicePixelRatio: number;
    }
    export interface IMapState {
      width: number;
      height: number;
    }
  }
}
