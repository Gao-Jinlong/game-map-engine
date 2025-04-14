import { BaseComponent } from "@core/components/BaseComponent";

export type ComponentId = number;

declare global {
    namespace MapEngine {
        export interface IComponentManager extends ISystem {
            add(component: BaseComponent): void;
            remove(component: BaseComponent): void;
            getComponent<T extends BaseComponent>(
                componentId: ComponentId
            ): T | undefined;
        }
    }
}
