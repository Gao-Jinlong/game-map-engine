import { EventTarget } from "../EventTarget";

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
    public type: string;
    public target: EventTarget | null;
    public timeStamp: number;
    public immediatePropagationStopped = false;
    public propagationStopped = false;

    constructor(type: string, target: EventTarget | null) {
        this.timeStamp = Date.now();

        this.type = type;
        this.target = target;
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
