import { IDisposable } from "../Disposable";
import { BaseEvent } from "./BaseEvent";

export type Listener<E extends BaseEvent = BaseEvent> = (
    event: E
) => void | boolean;
export interface IEventTarget extends IDisposable {
    addEventListener(type: string, listener: Listener): void;
    removeEventListener(type: string, listener: Listener): void;
    dispatchEvent(event: BaseEvent | string): void;
}
