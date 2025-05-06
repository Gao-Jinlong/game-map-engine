import { IMap } from "@core/interfaces";
import {
    EventKey,
    IPointerEvent,
    MapEventKeys,
} from "../systems/Intercation/interface";
import { BaseEvent } from "./BaseEvent";
import { Vector2 } from "three";

export class PointerEvent extends BaseEvent implements IPointerEvent {
    constructor(
        public type:
            | EventKey.POINTER_DOWN
            | EventKey.POINTER_MOVE
            | EventKey.POINTER_UP
            | EventKey.CLICK,
        public context: IMap,
        public event: Event,
        public pointer: Vector2
    ) {
        super(type);
    }
}
