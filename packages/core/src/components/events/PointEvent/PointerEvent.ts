import { BaseEvent } from "../BaseEvent";
import type { PointerEventType, IPointerEvent } from "../types";
import { EventTarget } from "../EventTarget";
import { IInteraction } from "@core/systems/intercation";
import { PointerEventTypeEnum } from "../EventType";
import { ICoord, IMap } from "@core/interfaces";
import { DOM } from "@core/utils/dom";
import { Point } from "@core/entity/Point";

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

    public point!: Point;
    public lnglat!: ICoord;
    // public eventable!: any;
    // declare pointerId: number;

    /**
     * 当前事件与上一个事件的时间差
     */
    private deltaTime: number = 0;
    private map: IMap;

    constructor(
        type: T,
        eventSource: IPointerEvent,
        interaction: IInteraction,
        eventTarget: EventTarget,
        map: IMap
    ) {
        super(eventTarget, type);
        this.type = type;
        this.map = map;
        this.point = DOM.mousePos(this.map.container, eventSource);
        this.lnglat = this.map.unproject(this.point);

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
}
