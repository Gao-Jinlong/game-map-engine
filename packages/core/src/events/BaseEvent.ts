import { IBaseEvent } from "../systems/Intercation/interface";
import { EventTarget } from "./EventTarget";

export class BaseEvent implements IBaseEvent {
    public defaultPrevented: boolean = false;
    public propagationStopped: boolean = false;
    public target?: EventTarget;
    public type: string;

    constructor(type: string) {
        this.type = type;
    }

    preventDefault() {
        this.defaultPrevented = true;
    }

    stopPropagation() {
        this.propagationStopped = true;
    }
}

export function stopPropagation(evt: BaseEvent) {
    evt.stopPropagation();
}

export function preventDefault(evt: BaseEvent) {
    evt.preventDefault();
}
