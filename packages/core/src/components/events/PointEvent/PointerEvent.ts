import { BaseEvent } from "../BaseEvent";
import type { PointerEventType, PointerType, Point } from "../types";
import Interaction from "../../../systems/Intercation/Interaction";
import { EventTarget } from "../EventTarget";

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

    constructor(eventSource: PointerEventType) {
        super(eventSource.type, eventSource.target);
    }
    preventDefault() {
        this.originalEvent.preventDefault();
    }
}
