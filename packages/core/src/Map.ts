import {
    EventManager,
    LifeCycleKey,
    MapEventKeys,
} from "./systems/Intercation";
import { ComponentManager } from "./systems/ComponentManager";
import { RendererSystem } from "./systems/RendererSystem";
import { CameraSystem } from "./systems/CameraSystem";
import { SceneSystem } from "./systems/SceneSystem";
import { toDefaulted } from "es-toolkit/compat";
import { SystemManager } from "./systems/SystemManager";
import Stats from "three/examples/jsm/libs/stats.module";
import * as THREE from "three";
import { IMap, IMapOptions, IMapState } from "@core/interfaces";
import { CrsSystem } from "./systems/CrsSystem";
import { TerrainSystem } from "./systems/TerrainSystem";
import { BaseComponent } from "./addons/BaseComponent";
import { BaseEvent, EventTarget } from "./events";
import { ResizeEvent } from "./events/ResizeEvent";

class Map extends EventTarget implements IMap {
    crsSystem: CrsSystem;
    container: HTMLElement;
    options: Required<IMapOptions>;
    state: IMapState;
    systemManager: SystemManager;
    stats: Stats;

    private destroyHandlers: (() => void)[] = [];
    constructor(options: IMapOptions) {
        super(options.container);
        if (!options.container) {
            console.warn("container is required");
        }

        this.options = toDefaulted(options, {
            container: document.body,
            background: 0x000000,
            devicePixelRatio: window.devicePixelRatio,
            center: [0, 0, 0],
            zoom: 1,
            pitch: 0,
            roll: 0,
            world: {
                width: 7500,
                height: 7500,
                depth: 1000,
            },
        });
        this.container = this.options.container;
        this.state = {
            width: Math.floor(this.container.clientWidth),
            height: Math.floor(this.container.clientHeight - 1),
            depth: 100,
        };

        this.crsSystem = new CrsSystem(this);
        this.systemManager = new SystemManager(this);

        this.systemManager.register(SceneSystem);
        this.systemManager.register(CameraSystem);
        this.systemManager.register(RendererSystem);
        this.systemManager.register(ComponentManager);
        this.systemManager.register(TerrainSystem);

        this.stats = new Stats();

        this.init();
    }

    init(): void {
        this.crsSystem.init();
        this.systemManager.init();

        this.container.appendChild(this.stats.dom);

        const observer = new ResizeObserver(this.onResize.bind(this));
        observer.observe(this.container);
        this.destroyHandlers.push(() => observer.disconnect());

        if (process.env.NODE_ENV === "development") {
            this.loadAxesHelper();
        }

        // this.eventManager.emit(LifeCycleKey.ON_READY, this);
    }
    disposeInternal() {
        this.container.removeChild(this.stats.dom);
        this.destroyHandlers.forEach((handler) => handler());
        this.systemManager.dispose();
        super.disposeInternal();
    }

    addComponent(component: BaseComponent): void {
        this.systemManager.getSystem(ComponentManager).add(component);
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
            new ResizeEvent(this.state.width, this.state.height)
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
