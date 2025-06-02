import { IDisposable } from "@core/components/Disposable";
import { IEventTarget } from "@core/components/events";
import { PointerEvent } from "@core/events";

/**
 * 事件系统
 *
 * 捕获 dom 事件，转换为 map 事件分发到需要的 system 中
 */
export interface IEventCapture extends IDisposable {
    init(): void;
    // register(): void;
    // unregister(): void;
    // dispatch(): void;
}

/**
 * 交互处理程序
 */
export interface IInteraction extends IDisposable {
    target: IEventTarget;
    previousTapEvent: PointerEvent | null;
    pointerDown(event: PointerEvent): void;
    pointerMove(event: PointerEvent): void;
    pointerUp(event: PointerEvent): void;
    tap(event: PointerEvent): void;
    doubleTap(event: PointerEvent): void;
}
