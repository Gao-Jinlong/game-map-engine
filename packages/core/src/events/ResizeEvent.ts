import { BaseEvent } from "./BaseEvent";
import { EventType } from "./EventType";

export class ResizeEvent extends BaseEvent {
    public type = EventType.RESIZE;
    constructor(public width: number, public height: number) {
        super(EventType.RESIZE);
    }
}
