import { EventTarget } from "../EventTarget";
import { EventType } from "../EventType";

/**
 * 事件基类接口
 */
export interface IBaseEvent {
    type: string;
}

/**
 * 事件基类
 */
export class BaseEvent {
    public timeStamp: number;

    public type!: EventType;
    public target?: EventTarget;
    public immediatePropagationStopped: boolean = false;
    public propagationStopped: boolean = false;

    constructor(target: EventTarget, type: EventType) {
        this.timeStamp = Date.now();

        this.target = target;
        this.type = type;
    }

    preventDefault() {}

    /**
     * Don't call any other listeners (even on the current target)
     */
    stopPropagation() {
        this.propagationStopped = true;
    }

    /**
     * Don't call listeners on the remaining targets
     */
    stopImmediatePropagation() {
        this.immediatePropagationStopped = this.propagationStopped = true;
    }
}

export function stopPropagation(evt: BaseEvent) {
    evt.stopPropagation();
}

export function preventDefault(evt: BaseEvent) {
    evt.preventDefault();
}
