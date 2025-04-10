import { EventManager } from "./systems/EventManager";
import { ComponentManager } from "./systems/ComponentManager";
import { RendererSystem } from "./systems/RendererSystem";
import { CameraSystem } from "./systems/CameraSystem";
import { SceneSystem } from "./systems/SceneSystem";
import { toDefaulted } from "es-toolkit/compat";
import { SystemManager } from "./systems/SystemManager";
import Stats from "three/examples/jsm/libs/stats.module";
import * as THREE from "three";

export class Map implements MapEngine.IMap {
    eventManager: EventManager;
    container: HTMLElement;
    options: Required<MapEngine.IMapOptions>;
    state: MapEngine.IMapState;
    systemManager: SystemManager;

    private stats: Stats;
    private destroyHandlers: (() => void)[] = [];
    constructor(options: MapEngine.IMapOptions) {
        if (!options.container) {
            console.warn("container is required");
        }

        this.options = toDefaulted(options, {
            container: document.body,
            background: 0x000000,
            devicePixelRatio: window.devicePixelRatio,
        });
        this.container = this.options.container;
        this.state = {
            width: Math.floor(this.container.clientWidth),
            height: Math.floor(this.container.clientHeight - 1),
            depth: 100,
        };

        this.eventManager = new EventManager(this);
        this.systemManager = new SystemManager(this);

        this.systemManager.register(SceneSystem);
        this.systemManager.register(CameraSystem);
        this.systemManager.register(RendererSystem);
        this.systemManager.register(ComponentManager);

        this.stats = new Stats();

        this.init();
    }

    init(): void {
        this.systemManager.init();

        this.container.appendChild(this.stats.dom);

        const observer = new ResizeObserver(this.onResize.bind(this));
        observer.observe(this.container);
        this.destroyHandlers.push(() => observer.disconnect());

        if (import.meta.env.DEV) {
            this.loadAxesHelper();
        }
    }

    loadAxesHelper(): void {
        const axesHelper = new THREE.AxesHelper(1000);
        const gridHelper = new THREE.GridHelper(1000, 20, 0x888888, 0x888888);
        this.systemManager.getSystem(SceneSystem).scene.add(axesHelper);
        this.systemManager.getSystem(SceneSystem).scene.add(gridHelper);
    }

    render(): void {}
    destroy(): void {
        this.destroyHandlers.forEach((handler) => handler());
    }

    onResize(entries: ResizeObserverEntry[], _observer: ResizeObserver): void {
        for (const entry of entries) {
            if (entry.target === this.container) {
                this.state.width = Math.floor(entry.contentRect.width);
                this.state.height = Math.floor(entry.contentRect.height - 1);
            }
        }

        this.eventManager.emit("resize", this.state);
    }
}
