import EventEmitter from "eventemitter3";

export class EventManager
    extends EventEmitter<MapEngine.MapEvents>
    implements MapEngine.IEventManager
{
    constructor(private context: MapEngine.IMap) {
        super();
    }

    init(): void {}
}
