import { BaseEvent } from "./BaseEvent";
import { LifeCycleKey } from "./EventType";

export class ResizeEvent extends BaseEvent {
    public type = LifeCycleKey.RESIZE;
    constructor(public width: number, public height: number) {
        super(LifeCycleKey.RESIZE);
    }
}
