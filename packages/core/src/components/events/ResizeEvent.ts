import { BaseEvent } from "./BaseEvent";
import { EventTarget } from "./EventTarget";
import { LifeCycleType } from "./EventType";

export class ResizeEvent extends BaseEvent {
    public type = LifeCycleType.RESIZE;
    constructor(
        public target: EventTarget,
        public width: number,
        public height: number
    ) {
        super(target);
    }
}
