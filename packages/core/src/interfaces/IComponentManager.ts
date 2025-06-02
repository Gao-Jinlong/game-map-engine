import { BaseComponent } from "@core/addons/BaseComponent";
import { ISystem } from "./ISystem";
import { ComponentId, IComponent } from "./IComponent";

export interface IComponentManager extends ISystem {
    add(component: IComponent): void;
    remove(component: IComponent): void;
    getComponent<T extends IComponent>(componentId: ComponentId): T | undefined;
}
