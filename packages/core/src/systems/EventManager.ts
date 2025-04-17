import { IEventManager, IMap, MapEvents } from "@core/interfaces";
import EventEmitter from "eventemitter3";

export class EventManager
    extends EventEmitter<MapEvents>
    implements IEventManager
{
    constructor(private context: IMap) {
        super();
    }

    init(): void {}
}
