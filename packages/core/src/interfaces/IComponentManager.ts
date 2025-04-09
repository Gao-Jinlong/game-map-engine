import { IComponent } from "./IComponent";

declare global {
  namespace MapEngine {
    export interface IComponentManager extends ISystem {
      register(component: IComponent): void;
      unregister(component: IComponent): void;
      getComponent<T extends IComponent>(component: new () => T): T | undefined;
    }
  }
}
