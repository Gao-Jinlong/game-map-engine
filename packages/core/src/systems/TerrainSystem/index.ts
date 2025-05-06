import {
    ComponentId,
    ICameraSystem,
    IMap,
    IMapState,
    ISystem,
} from "@core/interfaces";
import { ITerrain } from "../../components/Layer/interface";
import { Mesh, Raycaster, Vector2 } from "three";
import { CameraSystem } from "../CameraSystem";
import { IEventManager } from "@core/systems/Intercation";

/**
 * 地形系统
 *
 * 注册所有地形组件，并管理鼠标事件中的屏幕坐标到世界坐标的转换
 */
export class TerrainSystem implements ISystem {
    public context?: IMap;
    public components: Map<ComponentId, ITerrain> = new Map();
    private meshes: Map<ComponentId, Mesh> = new Map();
    private raycaster: Raycaster = new Raycaster();
    private cameraSystem?: ICameraSystem;
    private eventManager?: IEventManager;
    private destroyHandlers: (() => void)[] = [];

    constructor() {}
    init() {
        if (!this.context) {
            throw new Error("context is required");
        }

        this.eventManager = this.context?.eventManager;
        this.cameraSystem = this.context?.systemManager.getSystem(CameraSystem);
    }

    addComponent(component: ITerrain) {
        this.components.set(component.__component_id__, component);

        if (!this.meshes.has(component.__component_id__)) {
            this.meshes.set(component.__component_id__, component.mesh);
        }
    }

    removeComponent(component: ITerrain) {
        this.components.delete(component.__component_id__);
        this.meshes.delete(component.__component_id__);
    }

    resize?: ((state: IMapState) => void) | undefined;
    destroy?: (() => void) | undefined;
    getCoordinateByPoint(point: Vector2) {
        const camera = this.cameraSystem?.camera;
        if (!camera) {
            return;
        }

        this.raycaster.setFromCamera(point, camera);
        const intersects = this.raycaster.intersectObjects(
            Array.from(this.meshes.values())
        );
        return intersects;
    }
}
