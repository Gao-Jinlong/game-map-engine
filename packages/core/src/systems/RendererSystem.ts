import * as THREE from "three";
import { CameraSystem } from "./CameraSystem";
import { SceneSystem } from "./SceneSystem";
import { IMap, IMapState, IRendererSystem } from "@core/interfaces";
import { BaseEvent, LifeCycleType } from "@core/events";
import { MarkerSystem } from "./markerSystem";

export class RendererSystem implements IRendererSystem {
    public renderer: THREE.WebGLRenderer;
    public context?: IMap;

    private camera?: THREE.Camera;
    private scene?: THREE.Scene;
    // private eventManager?: IEventManager;
    constructor() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
        });
    }

    init() {
        if (!this.context) {
            throw new Error(
                "RendererSystem must be initialized with a context"
            );
        }
        const { state, options, container, systemManager } = this.context;

        this.renderer.setPixelRatio(options.devicePixelRatio);
        this.renderer.setSize(state.width, state.height);
        this.renderer.setClearColor(options.background);

        const cameraSystem = systemManager.getSystem(CameraSystem);
        const sceneSystem = systemManager.getSystem(SceneSystem);

        // this.eventManager = this.context.eventManager;

        container.appendChild(this.renderer.domElement);
        this.camera = cameraSystem.camera;
        this.scene = sceneSystem.scene;

        this.renderer.setAnimationLoop(this.animate.bind(this));
    }

    resize(state: IMapState) {
        this.renderer.setSize(state.width, state.height);
        this.renderer.render(this.scene!, this.camera!);
    }

    animate(time: number, frame: XRFrame) {
        this.context?.dispatchEvent(
            new BaseEvent(this.context, LifeCycleType.PRE_FRAME)
        );
        this.render();
        this.context?.dispatchEvent(
            new BaseEvent(this.context, LifeCycleType.POST_FRAME)
        );
    }
    render() {
        this.context?.stats.update();
        this.renderer.render(this.scene!, this.camera!);
    }

    destroy() {
        this.renderer.dispose();
        this.renderer.domElement.remove();
    }
}
