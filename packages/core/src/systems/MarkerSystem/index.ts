import {
    ComponentId,
    ICameraSystem,
    IMap,
    IMapState,
    ISystem,
} from "@core/interfaces";
import { Object3D, Raycaster, Vector2 } from "three";
import { CameraSystem } from "../CameraSystem";
import { Marker } from "@core/addons/Marker/Marker";
import { IMarker } from "@core/marker";

/**
 * 标记系统
 *
 * 管理所有 Marker 组件，并处理鼠标事件与 Marker 的交互
 */
export class MarkerSystem implements ISystem {
    public context?: IMap;
    public components: Map<ComponentId, IMarker> = new Map();
    private objects: Map<ComponentId, Object3D> = new Map();
    private raycaster: Raycaster = new Raycaster();
    private cameraSystem?: ICameraSystem;
    private destroyHandlers: (() => void)[] = [];

    constructor() {}

    init() {
        if (!this.context) {
            throw new Error("context is required");
        }

        this.cameraSystem = this.context?.systemManager.getSystem(CameraSystem);
    }

    addComponent(component: Marker) {
        this.components.set(component.__component_id__, component);

        const object = component.getObject3D();
        if (object && !this.objects.has(component.__component_id__)) {
            this.objects.set(component.__component_id__, object);
        }
    }

    removeComponent(component: Marker) {
        this.components.delete(component.__component_id__);
        this.objects.delete(component.__component_id__);
    }

    resize?: ((state: IMapState) => void) | undefined;
    destroy?: (() => void) | undefined;

    /**
     * 根据屏幕坐标检测点击的 Marker
     */
    getMarkerByPoint(
        point: Vector2
    ): { marker: IMarker; object: Object3D } | null {
        const camera = this.cameraSystem?.camera;
        if (!camera) {
            return null;
        }

        const objects = Array.from(this.objects.values());
        this.raycaster.setFromCamera(point, camera);
        const intersects = this.raycaster.intersectObjects(objects);

        if (intersects.length > 0) {
            const intersectedObject = intersects[0].object;

            // 查找对应的 Marker
            for (const [componentId, object] of this.objects.entries()) {
                if (object === intersectedObject) {
                    const marker = this.components.get(componentId);
                    if (marker) {
                        return { marker, object: intersectedObject };
                    }
                }
            }
        }

        return null;
    }

    /**
     * 获取所有可交互的 Marker
     */
    getInteractiveMarkers(): IMarker[] {
        return Array.from(this.components.values()).filter(
            (marker) => marker.options.interactive
        );
    }

    /**
     * 处理 Marker 点击事件
     */
    handleMarkerClick(point: Vector2): boolean {
        const result = this.getMarkerByPoint(point);
        if (result && result.marker.options.interactive) {
            result.marker.handleClick();
            return true; // 表示事件被处理了
        }
        return false; // 表示没有 Marker 被点击
    }

    /**
     * 处理 Marker 悬停事件
     */
    handleMarkerHover(point: Vector2): IMarker | null {
        const result = this.getMarkerByPoint(point);
        if (result && result.marker.options.interactive) {
            return result.marker;
        }
        return null;
    }
}
