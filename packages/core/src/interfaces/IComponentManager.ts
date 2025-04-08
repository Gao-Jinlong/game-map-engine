import { IComponent } from "./IComponent";

export interface IComponentManager {
  register(component: IComponent): void;
  unregister(component: IComponent): void;
  getComponent<T extends IComponent>(component: new () => T): T | undefined;
}
