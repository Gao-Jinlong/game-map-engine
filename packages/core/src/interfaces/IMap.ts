import { IEventManager } from "./IEventManager";
import { IComponentManager } from "./IComponentManager";
import { IRenderer } from "./IRenderer";
import { ICamera } from "./ICamera";
import { IScene } from "./IScene";

export interface IMap {
  eventManager: IEventManager;
  componentManager: IComponentManager;
  renderer: IRenderer;
  camera: ICamera;
  scene: IScene;
}
