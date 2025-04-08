import { IMap } from "../interfaces/IMap";
import { IRenderer } from "../interfaces/IRenderer";

export class Renderer implements IRenderer {
  constructor(private context: IMap) {}
}
