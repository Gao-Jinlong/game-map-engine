import { ComponentId } from "@core/interfaces/IComponentManager";
import { SceneSystem } from "./SceneSystem";
import { CameraSystem } from "./CameraSystem";

export class ComponentManager implements MapEngine.IComponentManager {
    private components: Map<string, MapEngine.IComponent> = new Map();
    public context?: MapEngine.IMap;

    private sceneSystem?: SceneSystem;
    private cameraSystem?: CameraSystem;
    constructor() {}
    init() {
        if (!this.context) {
            throw new Error(
                "ComponentManager must be initialized with a context"
            );
        }

        this.sceneSystem = this.context.systemManager.getSystem(SceneSystem);
        this.cameraSystem = this.context.systemManager.getSystem(CameraSystem);
    }
    add(component: MapEngine.IComponent): void {
        // TODO
        component.init;

        const componentName = component.constructor.name;
        this.components.set(componentName, component);
    }

    remove(component: MapEngine.IComponent): void {
        const componentName = component.constructor.name;
        this.components.delete(componentName);
    }

    getComponent<T extends MapEngine.IComponent>(
        componentId: ComponentId
    ): T | undefined {
        return this.components.get(componentId) as T | undefined;
    }
}
