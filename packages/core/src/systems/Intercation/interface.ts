import Disposable from "@core/components/Disposable";
import { PointerEvent } from "@core/events";

/**
 * 事件系统
 *
 * 捕获 dom 事件，转换为 map 事件分发到需要的 system 中
 */
export interface IEventCapture extends Disposable {
    // register(): void;
    // unregister(): void;
    // dispatch(): void;
}

/**
 * 交互处理程序
 */
export interface IInteraction {
    previousEvent: PointerEvent | null;
    pointerDown(event: PointerEvent): void;
    pointerMove(event: PointerEvent): void;
    pointerUp(event: PointerEvent): void;
}

export enum PointerEventTypeEnum {
    TAP = "tap",
    DOUBLE_TAP = "doubleTap",
    POINTER_DOWN = "pointerDown",
    POINTER_MOVE = "pointerMove",
    POINTER_UP = "pointerUp",
}
