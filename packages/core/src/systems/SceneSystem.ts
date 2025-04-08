import { IScene } from "../interfaces/IScene";
import { IMap } from "../interfaces/IMap";
import { Scene as ThreeScene } from "three";

export class SceneSystem implements IScene {
  private context: IMap | null = null;
  private scene: ThreeScene;

  constructor(private context: IMap) {
    this.scene = new ThreeScene();
  }

  init(context: IMap): void {
    this.context = context;
  }

  update(): void {
    // 场景更新逻辑
  }
}
