import { ComponentId, IComponentManager } from "@core/interfaces";
import { SceneSystem } from "./SceneSystem";
import { CameraSystem } from "./CameraSystem";
import { BaseComponent } from "@core/addons/BaseComponent";
import { isComponentId } from "@core/utils";
import { IMap } from "@core/interfaces";
import { Marker } from "@core/addons/Marker/Marker";
import { MarkerSystem } from "./MarkerSystem";

export class ComponentManager implements IComponentManager {
    private components: Map<ComponentId, BaseComponent> = new Map();
    private componentNameMap: Map<string, BaseComponent> = new Map();
    public context?: IMap;
    private sceneSystem?: SceneSystem;
    private cameraSystem?: CameraSystem;
    private markerSystem?: MarkerSystem;

    constructor() {}

    init() {
        if (!this.context) {
            throw new Error(
                "ComponentManager must be initialized with a context"
            );
        }

        this.sceneSystem = this.context.systemManager.getSystem(SceneSystem);
        this.cameraSystem = this.context.systemManager.getSystem(CameraSystem);
        this.markerSystem = this.context.systemManager.getSystem(MarkerSystem);
    }

    add(component: BaseComponent): void {
        if (component.name) {
            this.componentNameMap.set(component.name, component);
        }
        this.components.set(component.__component_id__, component);

        component.context = this.context;
        component.sceneSystem = this.sceneSystem;
        component.cameraSystem = this.cameraSystem;

        // 如果是 Marker 组件，同时注册到 MarkerSystem
        if (component instanceof Marker) {
            this.markerSystem?.addComponent(component);
        }

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

            // 如果是 Marker 组件，同时从 MarkerSystem 移除
            if (component instanceof Marker) {
                this.markerSystem?.removeComponent(component);
            }

            component.onRemove?.();
        }
    }

    getComponent<T extends BaseComponent>(
        componentId: ComponentId
    ): T | undefined {
        return this.components.get(componentId) as T | undefined;
    }

    destroy() {
        this.components.forEach((component) => {
            component.onRemove?.();
        });
    }
}
