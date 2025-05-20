import { BaseEvent } from "../BaseEvent";
import type { PointerEventType, PointerType, Point } from "../types";
import Interaction from "../../../systems/Intercation/Interaction";
import { EventTarget } from "../EventTarget";
import { IInteraction, PointerEventTypeEnum } from "@core/systems/Intercation";

/**
 * TODO 重构 PointerEvent 类，不需要实现复杂的交互机制，只实现当前的简单需求即可
 */
export class PointerEvent<T extends string = any> extends BaseEvent {
    declare originalEvent: PointerEventType;

    static DOUBLE_TAP_INTERVAL = 500;
    public type: T;
    /**
     * 是否是双击事件
     */
    public double: boolean = false;
    /**
     * 当前事件与上一个事件的时间差
     */
    private deltaTime: number = 0;

    // declare pointerId: number;
    // declare pointerType: string;
    // declare double: boolean;
    // declare pageX: number;
    // declare pageY: number;
    // declare clientX: number;
    // declare clientY: number;
    // declare dt: number;
    declare eventable: any;
    [key: string]: any;

    constructor(
        type: T,
        eventSource: PointerEventType,
        eventTarget?: EventTarget,
        interaction?: IInteraction
    ) {
        super(eventTarget);
        this.type = type;

        this.handleEvent(eventSource);

        if (type === PointerEventTypeEnum.TAP) {
            const previousEvent = interaction?.previousEvent;
            if (previousEvent) {
                this.deltaTime = this.timeStamp - previousEvent.timeStamp;
                if (this.deltaTime < PointerEvent.DOUBLE_TAP_INTERVAL) {
                    this.double = true;
                    previousEvent.double = true;
                }
            }
        } else if (type === PointerEventTypeEnum.DOUBLE_TAP) {
            this.deltaTime =
                this.timeStamp -
                (interaction?.previousEvent?.timeStamp ?? this.deltaTime);
            this.double = true;
        }
    }
    preventDefault() {
        this.originalEvent.preventDefault();
    }

    handleEvent(eventSource: PointerEventType) {
        this.originalEvent = eventSource;
    }

    handleType(type: string) {
        switch (type) {
            case "pointerdown":
                return "pointerDown";
            case "pointermove":
                return "pointerMove";
            case "pointerup":
                return "pointerUp";
            default:
                return type;
        }
    }
}
