import { Position } from "@core/entity";
import {
    IEventManager,
    IMap,
    MapEventKey,
    MapEvents,
    MapLifeCycleKey,
} from "@core/interfaces";
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
    constructor(public context: IMap) {
        super();
        this.container = this.context.container;
        this.crsSystem = this.context.crsSystem;
    }

    init(): void {
        const events = [
            EventEnum.CLICK,
            EventEnum.RESIZE,
            EventEnum.MOUSE_DOWN,
            EventEnum.MOUSE_UP,
            EventEnum.MOUSE_MOVE,
        ];

        events.forEach((event) => {
            const dispatch = this.dispatch.bind(this, event);
            this.container.addEventListener(event, dispatch);
            this.destroyHandlers.push(() => {
                this.container.removeEventListener(event, dispatch);
            });
        });

        this.once(MapLifeCycleKey.ON_READY, () => {
            this.cameraSystem =
                this.context.systemManager.getSystem(CameraSystem);
        });
    }

    dispatch(type: EventEnum, event: Event): void {
        if (event instanceof MouseEvent) {
            const { offsetX, offsetY } = event;

            this.pointer.x =
                (event.clientX / this.container.clientWidth) * 2 - 1;
            this.pointer.y =
                -(event.clientY / this.container.clientHeight) * 2 + 1;

            const { lon, lat } = this.crsSystem.unproject(
                new Position(offsetX, offsetY, 0)
            );

            // TODO 交互系统设计，将基础的 dom 键鼠事件转为复杂的 map 交互事件（如：双击、双指捏合等）
            // 考虑引入第三方库实现
            // 考虑冒泡机制，现有事件系统能否支持冒泡？

            this.emit(MapEventKey.CLICK, {
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
