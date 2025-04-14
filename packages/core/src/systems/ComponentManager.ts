import { ComponentId } from "@core/interfaces/IComponentManager";
import { SceneSystem } from "./SceneSystem";
import { CameraSystem } from "./CameraSystem";
import { BaseComponent } from "@core/components/BaseComponent";
import { isNumber } from "es-toolkit/compat";
import { isComponentId } from "@core/utils";

export class ComponentManager implements MapEngine.IComponentManager {
    private components: Map<ComponentId, BaseComponent> = new Map();
    private componentNameMap: Map<string, BaseComponent> = new Map();
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
    add(component: BaseComponent): void {
        if (component.name) {
            this.componentNameMap.set(component.name, component);
        }
        this.components.set(component.__component_id__, component);

        component.context = this.context;
        component.sceneSystem = this.sceneSystem;
        component.cameraSystem = this.cameraSystem;

        component.onAdd?.();
    }

    remove(componentOrId: BaseComponent | ComponentId): void {
        let component: BaseComponent | undefined;
        if (isComponentId(componentOrId)) {
            component = this.components.get(componentOrId);
        } else {
            component = componentOrId;
        }
        if (component) {
            this.components.delete(component.__component_id__);
            if (component.name) {
                this.componentNameMap.delete(component.name);
            }
            component.onRemove?.();
        }
    }

    getComponent<T extends BaseComponent>(
        componentId: ComponentId
    ): T | undefined {
        return this.components.get(componentId) as T | undefined;
    }
}
