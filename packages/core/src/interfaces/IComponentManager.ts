import { BaseComponent } from "@core/components/BaseComponent";
import { ISystem } from "./ISystem";

export type ComponentId = number;

export interface IComponentManager extends ISystem {
    add(component: BaseComponent): void;
    remove(component: BaseComponent): void;
    getComponent<T extends BaseComponent>(
        componentId: ComponentId
    ): T | undefined;
}
