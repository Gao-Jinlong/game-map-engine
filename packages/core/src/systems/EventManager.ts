import {
    BaseEventPayload,
    IEventManager,
    IMap,
    MapEvents,
} from "@core/interfaces";
import { ICrsSystem } from "@core/interfaces/ICRSSystem";
import EventEmitter from "eventemitter3";

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
    constructor(private context: IMap) {
        super();
        this.container = this.context.container;
        this.crsSystem = this.context.crsSystem;

        this.init();
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
    }

    dispatch(event: Event): void {
        if (event instanceof MouseEvent) {
            const { offsetX, offsetY } = event;

            const { lng, lat } = this.crsSystem.unproject(offsetX, offsetY);

            // TODO: 事件派发 or 快捷键注册机制？
            this.emit(EventEnum.CLICK, {
                lng,
                lat,
                context: this.context,
            });
        }
    }

    destroy(): void {
        this.removeAllListeners();
        this.destroyHandlers.forEach((handler) => handler());
    }
}
