import { IComponentManager } from "../interfaces/IComponentManager";
import { IComponent } from "../interfaces/IComponent";
import { IMap } from "../interfaces/IMap";

export class ComponentManager implements IComponentManager {
  private components: Map<string, IComponent> = new Map();

  constructor(private context: IMap) {}

  register(component: IComponent): void {
    const componentName = component.constructor.name;
    this.components.set(componentName, component);
  }

  unregister(component: IComponent): void {
    const componentName = component.constructor.name;
    this.components.delete(componentName);
  }

  getComponent<T extends IComponent>(component: new () => T): T | undefined {
    const componentName = component.name;
    return this.components.get(componentName) as T | undefined;
  }
}
