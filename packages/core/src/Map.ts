import { ComponentManager } from "./systems/ComponentManager";
import { RendererSystem } from "./systems/RendererSystem";
import { CameraSystem } from "./systems/CameraSystem";
import { SceneSystem } from "./systems/SceneSystem";
import { toDefaulted } from "es-toolkit/compat";
import { SystemManager } from "./systems/SystemManager";
import Stats from "three/examples/jsm/libs/stats.module";
import * as THREE from "three";
import {
    IBounds,
    IComponent,
    ICoord,
    ICoordTuple,
    IMap,
    IMapOptions,
    IMapState,
    IPosition,
    IPositionTuple,
} from "@core/interfaces";
import { CrsSystem } from "./systems/CrsSystem";
import { TerrainSystem } from "./systems/TerrainSystem";
import { MarkerSystem } from "./systems/MarkerSystem";
import { BaseComponent } from "./addons/BaseComponent";
import { BaseEvent, EventTarget } from "./events";
import { ResizeEvent } from "./components/events/ResizeEvent";
import {
    LifeCycleType,
    PointerEventTypeEnum,
} from "./components/events/EventType";
import {
    EventCaptureSystem,
    IEventCapture,
    IInteraction,
    Interaction,
} from "./systems/Intercation";
import { Bounds } from "./entity/Bounds";

class Map extends EventTarget implements IMap {
    // 暂时将 service 注册到 Map 上，后续可以通过 ServiceManager 集中管理注册
    eventCaptureService: IEventCapture;
    interactionService: IInteraction;

    crsSystem: CrsSystem;
    container: HTMLElement;
    options: Required<IMapOptions>;
    state: IMapState;
    systemManager: SystemManager;
    stats: Stats;
    bounds: IBounds;
    private destroyHandlers: (() => void)[] = [];
    constructor(options: IMapOptions) {
        super();

        if (!options.container) {
            console.warn("container is required");
        }

        // TODO 实现 projection , 用于计算世界坐标和像素坐标之间的转换，涉及 zoom , bounds, state.width, state.height
        this.options = toDefaulted(options, {
            container: document.body,
            background: 0x000000,
            devicePixelRatio: window.devicePixelRatio,
            center: [0, 0, 0],
            zoom: 1,
            pitch: 0,
            roll: 0,
            bounds: [0, 0, 0, 7500, 7500, 1000],
        });
        this.bounds = new Bounds(this.options.bounds);
        this.container = this.options.container;
        this.state = {
            width: Math.floor(this.container.clientWidth),
            height: Math.floor(this.container.clientHeight - 1),
        };

        this.eventCaptureService = new EventCaptureSystem(this);
        this.interactionService = new Interaction(this);
        this.systemManager = new SystemManager(this);
        this.crsSystem = new CrsSystem(this);

        this.systemManager.register(SceneSystem);
        this.systemManager.register(CameraSystem);
        this.systemManager.register(RendererSystem);
        this.systemManager.register(ComponentManager);
        this.systemManager.register(TerrainSystem);
        this.systemManager.register(MarkerSystem);

        this.stats = new Stats();

        this.init();
        this.dispatchEvent(new BaseEvent(this, LifeCycleType.ON_READY));

        this.devTest();
    }
    private devTest(): void {
        this.addEventListener(PointerEventTypeEnum.TAP, (event) => {
            console.log("🚀 ~ Map ~ this.addEventListener ~ event:", event);
        });
    }
    init(): void {
        this.eventCaptureService.init();
        this.crsSystem.init();
        this.systemManager.init();

        this.container.appendChild(this.stats.dom);

        const observer = new ResizeObserver(this.onResize.bind(this));
        observer.observe(this.container);
        this.destroyHandlers.push(() => observer.disconnect());

        if (process.env.NODE_ENV === "development") {
            this.loadAxesHelper();
        }
    }
    disposeInternal() {
        this.interactionService.dispose();
        this.eventCaptureService.dispose();

        this.container.removeChild(this.stats.dom);
        this.destroyHandlers.forEach((handler) => handler());
        this.systemManager.dispose();
        super.disposeInternal();
    }

    addComponent(component: IComponent): void {
        this.systemManager.getSystem(ComponentManager).add(component);
    }

    /**
     * 添加组件到地图（便捷方法）
     */
    add(component: BaseComponent): void {
        this.addComponent(component);
    }

    /**
     * 从地图移除组件
     */
    remove(component: BaseComponent): void {
        this.systemManager.getSystem(ComponentManager).remove(component);
    }

    project(coord: ICoordTuple | ICoord, zoom: number): IPosition {
        return this.crsSystem.coordToPoint(coord, zoom);
    }

    unproject(position: IPositionTuple | IPosition, zoom: number): ICoord {
        return this.crsSystem.pointToCoord(position, zoom);
    }

    private onResize(
        entries: ResizeObserverEntry[],
        _observer: ResizeObserver
    ): void {
        for (const entry of entries) {
            if (entry.target === this.container) {
                this.state.width = Math.floor(entry.contentRect.width);
                this.state.height = Math.floor(entry.contentRect.height - 1);
            }
        }

        this.systemManager.resize(this.state);

        this.dispatchEvent(
            new ResizeEvent(this, this.state.width, this.state.height)
        );
    }
    private loadAxesHelper(): void {
        const axesHelper = new THREE.AxesHelper(1000);
        const gridHelper = new THREE.GridHelper(1000, 20, 0x888888, 0x888888);
        this.systemManager.getSystem(SceneSystem).scene.add(axesHelper);
        this.systemManager.getSystem(SceneSystem).scene.add(gridHelper);
    }
}

export { Map };
