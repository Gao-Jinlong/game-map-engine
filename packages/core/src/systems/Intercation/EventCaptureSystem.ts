import { IMap } from "@core/interfaces";
import { IEventCapture, IInteraction } from "@core/systems/Intercation";
import { Vector2 } from "three";
import { BaseEvent, PointerEvent, PointerEventTypeEnum } from "../../events";
import Disposable from "@core/components/Disposable";
import { MapKeyboardEvent } from "@core/components/events/KeyboardEvent";
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
    private interactionService?: IInteraction;
    constructor(public context: IMap) {
        super();
        this.container = this.context.container;
    }

    init(): void {
        this.interactionService = this.context.interactionService;

        const events = [
            EventType.CLICK,
            EventType.RESIZE,
            EventType.MOUSE_DOWN,
            EventType.MOUSE_UP,
            EventType.MOUSE_MOVE,
        ];
        const keyEvents = [EventType.KEY_DOWN, EventType.KEY_UP];

        events.forEach((event) => {
            const dispatch = this.dispatchHandler.bind(this, event);
            this.container.addEventListener(event, dispatch);
            this.destroyHandlers.push(() => {
                this.container.removeEventListener(event, dispatch);
            });
        });

        keyEvents.forEach((event) => {
            const dispatch = this.dispatchHandler.bind(this, event);
            document.addEventListener(event, dispatch);
            this.destroyHandlers.push(() => {
                document.removeEventListener(event, dispatch);
            });
        });
    }

    dispatchHandler(type: EventType, event: Event): void {
        const pointEventType = this.handleEventType(type);
        if (pointEventType && eventUtils.isPointerEvent(event)) {
            const pointEvent = new PointerEvent(
                pointEventType,
                event,
                this.interactionService!,
                this.context
            );

            this.dispatchPointerEvent(pointEvent);
        }
    }

    dispatchPointerEvent(pointEvent: PointerEvent) {
        if (!this.interactionService) {
            throw Error("interactionService is not initialized");
        }

        switch (pointEvent.type) {
            case PointerEventTypeEnum.TAP:
                this.interactionService.tap(pointEvent);
                break;
            case PointerEventTypeEnum.DOUBLE_TAP:
                this.interactionService.doubleTap(pointEvent);
                break;
            case PointerEventTypeEnum.POINTER_DOWN:
                this.interactionService.pointerDown(pointEvent);
                break;
            case PointerEventTypeEnum.POINTER_UP:
                this.interactionService.pointerUp(pointEvent);
                break;
            case PointerEventTypeEnum.POINTER_MOVE:
                this.interactionService.pointerMove(pointEvent);
                break;
            default:
                break;
        }
    }

    handleEventType(type: EventType) {
        switch (type) {
            case EventType.CLICK:
                return PointerEventTypeEnum.TAP;
            case EventType.MOUSE_DOWN:
                return PointerEventTypeEnum.POINTER_DOWN;
            case EventType.MOUSE_UP:
                return PointerEventTypeEnum.POINTER_UP;
            case EventType.MOUSE_MOVE:
                return PointerEventTypeEnum.POINTER_MOVE;
            case EventType.KEY_DOWN:
            case EventType.KEY_UP:
            case EventType.RESIZE:
                return void 0;
            default:
                let _exhaustiveCheck: never = type;
                return void 0;
        }
    }
    // TODO : 临时 将 dom 事件转为 map 事件
    // private createEvent(type: EventType, event: Event) {
    //     if (
    //         event instanceof MouseEvent &&
    //         (type === EventType.CLICK || type === EventType.MOUSE_DOWN)
    //     ) {
    //         return new PointerEvent(event);
    //     } else if (
    //         event instanceof KeyboardEvent &&
    //         (type === EventType.KEY_DOWN || type === EventType.KEY_UP)
    //     ) {
    //         // TODO 临时测试使用，后续需要通过 ActionService 来处理
    //         const evt = new MapKeyboardEvent(event);

    //         // if (evt.ctrlKey && evt.key === "c") {
    //         //     evt.preventDefault();
    //         //     evt.stopPropagation();
    //         //     this.context.dispatchEvent(MapEventType.COPY);
    //         // }

    //         return evt;
    //     } else {
    //         return new BaseEvent(type);
    //     }
    // }

    disposeInternal(): void {
        this.destroyHandlers.forEach((handler) => handler());
    }
}
