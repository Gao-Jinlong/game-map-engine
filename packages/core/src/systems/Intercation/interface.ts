import Disposable from "@core/components/Disposable";

/**
 * 事件系统
 *
 * 捕获 dom 事件，转换为 map 事件分发到需要的 system 中
 */
export interface IEventDispatcher extends Disposable {
    // register(): void;
    // unregister(): void;
    // dispatch(): void;
}
