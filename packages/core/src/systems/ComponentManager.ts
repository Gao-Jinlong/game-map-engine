import { IComponent } from "../interfaces/IComponent";

export class ComponentManager implements MapEngine.IComponentManager {
    private components: Map<string, IComponent> = new Map();
    public context?: MapEngine.IMap;
    constructor() {}
    init() {
        if (!this.context) {
            throw new Error(
                "ComponentManager must be initialized with a context"
            );
        }
    }
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
