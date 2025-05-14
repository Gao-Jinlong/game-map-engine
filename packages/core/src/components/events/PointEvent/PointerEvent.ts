import { BaseEvent } from "../BaseEvent";
import type { PointerEventType, PointerType, Point } from "../types";
import Interaction from "../Interaction";

/**
 * TODO 重构 PointerEvent 类，不需要实现复杂的交互机制，只实现当前的简单需求即可
 */
export class PointerEvent<T extends string = any> extends BaseEvent {
    declare type: T;
    declare originalEvent: PointerEventType;
    declare pointerId: number;
    declare pointerType: string;
    declare double: boolean;
    declare pageX: number;
    declare pageY: number;
    declare clientX: number;
    declare clientY: number;
    declare dt: number;
    declare eventable: any;
    [key: string]: any;

    constructor(
        type: T,
        pointer: PointerType | PointerEvent<any>,
        event: PointerEventType,
        eventTarget: Node,
        interaction: Interaction,
        timeStamp: number
    ) {
        super();
    }
    preventDefault() {
        this.originalEvent.preventDefault();
    }
}
