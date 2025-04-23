import { Position } from "@core/entity";
import { IEventManager, IMap, MapEvents } from "@core/interfaces";
import { ICrsSystem } from "@core/interfaces/ICrsSystem";
import EventEmitter from "eventemitter3";
import { Raycaster, Vector2 } from "three";
import { CameraSystem } from "./CameraSystem";

export enum EventEnum {
    MOUSE_DOWN = "mousedown",
    MOUSE_UP = "mouseup",
    MOUSE_MOVE = "mousemove",
    CLICK = "click",
    RESIZE = "resize",
}

export class EventManager
    extends EventEmitter<MapEvents>
    implements IEventManager
{
    private container: HTMLElement;
    private crsSystem: ICrsSystem;
    private destroyHandlers: (() => void)[] = [];
    private cameraSystem?: CameraSystem;
    public pointer: Vector2 = new Vector2();
    public raycaster: Raycaster = new Raycaster();
    constructor(public context: IMap) {
        super();
        this.container = this.context.container;
        this.crsSystem = this.context.crsSystem;
    }

    init(): void {
        const dispatch = this.dispatch.bind(this);
        const events = [
            EventEnum.CLICK,
            EventEnum.RESIZE,
            EventEnum.MOUSE_DOWN,
            EventEnum.MOUSE_UP,
            EventEnum.MOUSE_MOVE,
        ];

        events.forEach((event) => {
            this.container.addEventListener(event, dispatch);
        });

        this.destroyHandlers.push(() => {
            events.forEach((event) => {
                this.container.removeEventListener(event, dispatch);
            });
        });

        this.once("onReady", () => {
            this.cameraSystem =
                this.context.systemManager.getSystem(CameraSystem);
        });
    }

    dispatch(event: Event): void {
        if (event instanceof MouseEvent) {
            const { offsetX, offsetY } = event;

            // 事件发生在二维屏幕上，因此没有 z 维度， z 需要从具体实体上获取
            this.pointer.x =
                (event.clientX / this.container.clientWidth) * 2 - 1;
            this.pointer.y =
                -(event.clientY / this.container.clientHeight) * 2 + 1;

            const { lon, lat } = this.crsSystem.unproject(
                new Position(offsetX, offsetY, 0)
            );
            // console.log("🚀 ~ dispatch ~ lon, lat :", lon, lat);

            this.emit(EventEnum.CLICK, {
                lon,
                lat,
                pointer: this.pointer,
                context: this.context,
            });
        }
    }

    destroy(): void {
        this.removeAllListeners();
        this.destroyHandlers.forEach((handler) => handler());
    }
}
