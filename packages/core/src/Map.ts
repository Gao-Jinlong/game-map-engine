import { IMap } from "./interfaces/IMap";
import { IComponentManager } from "./interfaces/IComponentManager";
import { IEventManager } from "./interfaces/IEventManager";
import { IRenderer } from "./interfaces/IRenderer";
import { ICamera } from "./interfaces/ICamera";
import { IScene } from "./interfaces/IScene";
import { EventManager } from "./systems/EventManager";
import { ComponentManager } from "./systems/ComponentManager";
import { Renderer } from "./systems/Renderer";
import { CameraSystem } from "./systems/CameraSystem";
import { SceneSystem } from "./systems/SceneSystem";
export class Map implements IMap {
  eventManager: IEventManager;
  componentManager: IComponentManager;
  renderer: IRenderer;
  camera: ICamera;
  scene: IScene;

  constructor() {
    this.eventManager = new EventManager(this);
    this.componentManager = new ComponentManager(this);
    this.renderer = new Renderer(this);
    this.camera = new CameraSystem(this);
    this.scene = new SceneSystem(this);
  }

  init(context: IMap): void {}

  update(): void {
    this.scene.update();
    this.camera.update();
  }

  render(): void {}

  destroy(): void {}
}
