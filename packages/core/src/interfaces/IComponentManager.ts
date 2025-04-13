export type ComponentId = string;

declare global {
    namespace MapEngine {
        export interface IComponent {
            init(): void;
            update(): void;
            render(): void;
            destroy(): void;
        }

        export interface IComponentManager extends ISystem {
            add(component: IComponent): void;
            remove(component: IComponent): void;
            getComponent<T extends IComponent>(
                componentId: ComponentId
            ): T | undefined;
        }
    }
}
