import {
    ComponentId,
    ICameraSystem,
    IEventManager,
    IMap,
    IMapState,
    ISystem,
    MapEventKey,
} from "@core/interfaces";
import { ITerrain } from "../../components/Layer/interface";
import { Raycaster } from "three";
import { CameraSystem } from "../CameraSystem";
import { EventEnum, EventManager } from "../EventManager";

/**
 * 地形系统
 *
 * 注册所有地形组件，并管理鼠标事件中的屏幕坐标到世界坐标的转换
 */
export class TerrainSystem implements ISystem {
    public context?: IMap;
    public components: Map<ComponentId, ITerrain> = new Map();
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

        const bind = this.onPointerMove.bind(this);
        this.eventManager?.on(MapEventKey.POINTER_MOVE, bind);
        this.destroyHandlers.push(() => {
            this.eventManager?.off(MapEventKey.POINTER_MOVE, bind);
        });
    }

    addComponent(component: ITerrain) {
        this.components.set(component.__component_id__, component);
    }

    removeComponent(component: ITerrain) {
        this.components.delete(component.__component_id__);
    }

    resize?: ((state: IMapState) => void) | undefined;
    destroy?: (() => void) | undefined;

    onPointerMove(event: MouseEvent) {
        const { lat, lng } = this.eventManager?.pointer;
        const camera = this.cameraSystem?.camera;
        if (!camera) {
            return;
        }
    }
}
