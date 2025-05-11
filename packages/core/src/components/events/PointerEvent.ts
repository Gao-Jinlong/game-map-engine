import { IMap } from "@core/interfaces";
import { EventKey, IPointerEvent } from "../../systems/Intercation/interface";
import { BaseEvent } from "./BaseEvent";
import { Vector2 } from "three";
import { MAP_EVENT_TYPE, MapEventType } from "./EventType";

export class PointerEvent extends BaseEvent implements IPointerEvent {
    constructor(
        public type: MapEventType,
        public context: IMap,
        public event: Event,
        public pointer: Vector2
    ) {
        super(type);
    }
}
