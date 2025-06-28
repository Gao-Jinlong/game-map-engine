import { ComponentId, IComponent, IComponentManager } from "@core/interfaces";
import { SceneSystem } from "./SceneSystem";
import { CameraSystem } from "./CameraSystem";
import { isComponentId } from "@core/utils";
import { IMap } from "@core/interfaces";
import { Marker } from "@core/addons/Marker/Marker";
import { MarkerSystem } from "./markerSystem";

export class ComponentManager implements IComponentManager {
    private components: Map<ComponentId, IComponent> = new Map();
    private componentNameMap: Map<string, IComponent> = new Map();
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

    add(component: IComponent): void {
        if (component.name) {
            this.componentNameMap.set(component.name, component);
        }
        this.components.set(component.__component_id__, component);

        component.context = this.context;
        component.sceneSystem = this.sceneSystem;
        component.cameraSystem = this.cameraSystem;

        component.onAdd?.();

        // 如果是 Marker 组件，同时注册到 MarkerSystem
        if (component instanceof Marker) {
            this.markerSystem?.addComponent(component);
        }
    }

    remove(componentOrId: IComponent | ComponentId): void {
        let component: IComponent | undefined;
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

    getComponent<T extends IComponent>(
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
