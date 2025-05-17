import { IMap } from "@core/interfaces";
import { IEventCapture } from "@core/systems/Intercation";
import { Vector2 } from "three";
import { BaseEvent, MapEventType, PointerEvent } from "../../events";
import Disposable from "@core/components/Disposable";
import { MapKeyboardEvent } from "@core/components/events/KeyboardEvent";
import Interaction from "@core/systems/Intercation/Interaction";
import * as eventUtils from "@core/utils/eventUtils";

/**
 * dom 事件类型
 */
export enum EventType {
    MOUSE_DOWN = "mousedown",
    MOUSE_UP = "mouseup",
    MOUSE_MOVE = "mousemove",
    CLICK = "click",
    RESIZE = "resize",
    KEY_DOWN = "keydown",
    KEY_UP = "keyup",
}

/**
 * 捕获 dom 事件，转换为 map 事件分发到需要的 system 中
 */
export class EventCaptureSystem extends Disposable implements IEventCapture {
    private container: HTMLElement;
    private destroyHandlers: (() => void)[] = [];
    constructor(public context: IMap) {
        super();
        this.container = this.context.container;

        this.init();
    }

    init(): void {
        const events = [
            EventType.CLICK,
            EventType.RESIZE,
            EventType.MOUSE_DOWN,
            EventType.MOUSE_UP,
            EventType.MOUSE_MOVE,
        ];
        const keyEvents = [EventType.KEY_DOWN, EventType.KEY_UP];

        events.forEach((event) => {
            const dispatch = this.dispatch.bind(this, event);
            this.container.addEventListener(event, dispatch);
            this.destroyHandlers.push(() => {
                this.container.removeEventListener(event, dispatch);
            });
        });

        keyEvents.forEach((event) => {
            const dispatch = this.dispatch.bind(this, event);
            document.addEventListener(event, dispatch);
            this.destroyHandlers.push(() => {
                document.removeEventListener(event, dispatch);
            });
        });
    }

    dispatch(type: EventType, event: Event): void {
        if (eventUtils.isPointerEvent(event)) {
            const pointEvent = new PointerEvent(event);
        }
    }

    // TODO : 临时 将 dom 事件转为 map 事件
    private createEvent(type: EventType, event: Event) {
        if (
            event instanceof MouseEvent &&
            (type === EventType.CLICK || type === EventType.MOUSE_DOWN)
        ) {
            return new PointerEvent(event);
        } else if (
            event instanceof KeyboardEvent &&
            (type === EventType.KEY_DOWN || type === EventType.KEY_UP)
        ) {
            // TODO 临时测试使用，后续需要通过 ActionService 来处理
            const evt = new MapKeyboardEvent(event);

            // if (evt.ctrlKey && evt.key === "c") {
            //     evt.preventDefault();
            //     evt.stopPropagation();
            //     this.context.dispatchEvent(MapEventType.COPY);
            // }

            return evt;
        } else {
            return new BaseEvent(type);
        }
    }

    disposeInternal(): void {
        this.destroyHandlers.forEach((handler) => handler());
    }
}
