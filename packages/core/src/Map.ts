import { IEventManager } from "./interfaces/IEventManager";
import { EventManager } from "./systems/EventManager";
import { ComponentManager } from "./systems/ComponentManager";
import { RendererSystem } from "./systems/RendererSystem";
import { CameraSystem } from "./systems/CameraSystem";
import { SceneSystem } from "./systems/SceneSystem";
import { toDefaulted } from "es-toolkit/compat";
import { SystemManager } from "./systems/SystemManager";

export class Map implements MapEngine.IMap {
  eventManager: IEventManager;
  container: HTMLElement;
  options: MapEngine.IMapOptions;
  state: MapEngine.IMapState;
  systemManager: SystemManager;
  constructor(options: MapEngine.IMapOptions) {
    this.options = toDefaulted(options, {
      container: document.body,
      background: 0x000000,
      devicePixelRatio: window.devicePixelRatio,
    });
    this.container = this.options.container;
    this.state = {
      width: this.container.clientWidth,
      height: this.container.clientHeight,
    };

    this.eventManager = new EventManager(this);
    // this.componentManager = new ComponentManager(this);

    // this.rendererSystem = new RendererSystem(this);
    // this.sceneSystem = new SceneSystem(this);
    // this.cameraSystem = new CameraSystem(this);

    this.systemManager = new SystemManager(this);
    [SceneSystem, CameraSystem, RendererSystem, ComponentManager].forEach(
      (SystemClass) => {
        this.systemManager.register(SystemClass);
      }
    );
    this.systemManager.init();
  }

  render(): void {}

  destroy(): void {}
}
