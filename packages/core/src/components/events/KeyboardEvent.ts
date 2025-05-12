import { BaseEvent, IBaseEvent } from "./BaseEvent";

/**
 * 键盘事件接口
 */
export interface IKeyboardEvent extends IBaseEvent {
    key: string;
    ctrlKey: boolean;
    shiftKey: boolean;
    altKey: boolean;
    metaKey: boolean;
}

/**
 * 键盘事件实例
 */
export class MapKeyboardEvent extends BaseEvent implements IKeyboardEvent {
    public key: string;
    public ctrlKey: boolean;
    public shiftKey: boolean;
    public altKey: boolean;
    public metaKey: boolean;

    constructor(public event: KeyboardEvent) {
        super(event.type);

        this.key = event.key;
        this.ctrlKey = event.ctrlKey;
        this.shiftKey = event.shiftKey;
        this.altKey = event.altKey;
        this.metaKey = event.metaKey;
    }
}
