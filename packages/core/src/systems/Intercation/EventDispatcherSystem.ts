import { Position } from "@core/entity";
import { IMap } from "@core/interfaces";
import { IEventDispatcher, EventKey } from "@core/systems/Intercation";
import { ICrsSystem } from "@core/interfaces/ICrsSystem";
import { Vector2 } from "three";
import { CameraSystem } from "../CameraSystem";
import {
    BaseEvent,
    LifeCycleKey,
    MAP_EVENT_TYPE,
    PointerEvent,
} from "../../events";
import Disposable from "@core/components/Disposable";

export const DOM_EVENT_TYPE = {
    MOUSE_DOWN: "mousedown",
    MOUSE_UP: "mouseup",
    MOUSE_MOVE: "mousemove",
    CLICK: "click",
    RESIZE: "resize",
} as const;
export type EventType = (typeof DOM_EVENT_TYPE)[keyof typeof DOM_EVENT_TYPE];

/**
 * 捕获 dom 事件，转换为 map 事件分发到需要的 system 中
 */
export class EventDispatcherSystem
    extends Disposable
    implements IEventDispatcher
{
    private container: HTMLElement;
    private destroyHandlers: (() => void)[] = [];
    public pointer: Vector2 = new Vector2();
    constructor(public context: IMap) {
        super();
        this.container = this.context.container;

        this.init();
    }

    init(): void {
        const events = [
            DOM_EVENT_TYPE.CLICK,
            DOM_EVENT_TYPE.RESIZE,
            DOM_EVENT_TYPE.MOUSE_DOWN,
            DOM_EVENT_TYPE.MOUSE_UP,
            DOM_EVENT_TYPE.MOUSE_MOVE,
        ];

        events.forEach((event) => {
            const dispatch = this.dispatch.bind(this, event);
            this.container.addEventListener(event, dispatch);
            this.destroyHandlers.push(() => {
                this.container.removeEventListener(event, dispatch);
            });
        });

        // this.context.addEventListener(LifeCycleKey.ON_READY, () => {
        //     this.cameraSystem =
        //         this.context.systemManager.getSystem(CameraSystem);
        // });
    }

    dispatch(type: EventType, event: Event): void {
        if (event instanceof MouseEvent) {
            this.pointer.x =
                (event.clientX / this.container.clientWidth) * 2 - 1;
            this.pointer.y =
                -(event.clientY / this.container.clientHeight) * 2 + 1;

            const eventSource = this.createEvent(type, event);
            this.context.dispatchEvent(eventSource);
        }
    }

    // TODO : 临时 将 dom 事件转为 map 事件
    // 考虑引入第三方库实现
    private createEvent(type: EventType, event: Event) {
        if (type === DOM_EVENT_TYPE.CLICK) {
            return new PointerEvent(
                EventKey.CLICK,
                this.context,
                event,
                this.pointer
            );
        } else if (type === DOM_EVENT_TYPE.MOUSE_MOVE) {
            return new PointerEvent(
                MAP_EVENT_TYPE.POINTER_MOVE,
                this.context,
                event,
                this.pointer
            );
        } else {
            return new BaseEvent(type);
        }
    }

    disposeInternal(): void {
        this.destroyHandlers.forEach((handler) => handler());
    }
}
