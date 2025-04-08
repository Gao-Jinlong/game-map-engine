import { IMap } from "./IMap";

export interface IScene {
  init(context: IMap): void;
  update(): void;
}
