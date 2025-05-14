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
export abstract class BaseEvent {
    declare type: string;
    declare target: EventTarget;
    declare currentTarget: Node;
    declare timeStamp: number;
    immediatePropagationStopped = false;
    propagationStopped = false;

    constructor() {}

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
