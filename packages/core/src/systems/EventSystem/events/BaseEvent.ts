import { IMap } from "@core/interfaces";
import { IBaseEvent, MapEventKeys } from "../interface";

export class BaseEvent implements IBaseEvent {
    constructor(
        public type: MapEventKeys,
        public context: IMap,
        public event: Event
    ) {}
}
