import { BaseEvent } from "../BaseEvent";
import type { PointerEventType, PointerType, Point } from "../types";
import { EventTarget } from "../EventTarget";
import { IInteraction } from "@core/systems/Intercation";
import { PointerEventTypeEnum } from "../EventType";

/**
 * TODO 重构 PointerEvent 类，不需要实现复杂的交互机制，只实现当前的简单需求即可
 */
export class PointerEvent<T extends string = any> extends BaseEvent {
    declare originalEvent: PointerEventType;

    static DOUBLE_TAP_INTERVAL = 200;
    public type: T;
    /**
     * 是否是双击事件
     */
    public double: boolean = false;

    public pageX!: number;
    public pageY!: number;
    public clientX!: number;
    public clientY!: number;
    // public eventable!: any;
    // declare pointerId: number;

    /**
     * 当前事件与上一个事件的时间差
     */
    private deltaTime: number = 0;

    constructor(
        type: T,
        eventSource: PointerEventType,
        interaction: IInteraction,
        eventTarget: EventTarget
    ) {
        super(eventTarget, type);
        this.type = type;

        this.handleEvent(eventSource);

        if (type === PointerEventTypeEnum.TAP) {
            const previousEvent = interaction.previousTapEvent;
            if (previousEvent) {
                this.deltaTime = this.timeStamp - previousEvent.timeStamp;
                if (
                    previousEvent.type !== PointerEventTypeEnum.POINTER_MOVE &&
                    previousEvent.target === this.target &&
                    this.deltaTime < PointerEvent.DOUBLE_TAP_INTERVAL
                ) {
                    this.double = true;
                    this.type = PointerEventTypeEnum.DOUBLE_TAP as T;
                }
            }
        } else if (type === PointerEventTypeEnum.DOUBLE_TAP) {
            this.deltaTime =
                this.timeStamp -
                (interaction.previousTapEvent?.timeStamp ?? this.deltaTime);
            this.double = true;
            this.type = PointerEventTypeEnum.DOUBLE_TAP as T;
        }
    }
    preventDefault() {
        this.originalEvent.preventDefault();
    }

    handleEvent(eventSource: PointerEventType) {
        if (eventSource instanceof MouseEvent) {
            this.originalEvent = eventSource;
            this.pageX = eventSource.pageX;
            this.pageY = eventSource.pageY;
            this.clientX = eventSource.clientX;
            this.clientY = eventSource.clientY;
        } else if (eventSource instanceof TouchEvent) {
            this.originalEvent = eventSource;
            this.pageX = eventSource.touches[0].pageX;
            this.pageY = eventSource.touches[0].pageY;
            this.clientX = eventSource.touches[0].clientX;
            this.clientY = eventSource.touches[0].clientY;
        }
    }
}
