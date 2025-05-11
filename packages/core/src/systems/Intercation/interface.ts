import { Vector2 } from "three";
import { IMap, IMapState } from "@core/interfaces";
import Disposable from "@core/components/Disposable";
import { MapEventType } from "@core/events";

/**
 * 地图事件
 *
 * 需要注意和 dom 事件区分，这个是地图引擎内部实现的事件，而不是 dom 提供的事件接口
 * 区别在于地图引擎会对事件进行封装，如 pointer 事件可以是 mouse 事件，也可以是 touch 事件,
 * 又如地图引擎可以支持 double click 等高级事件
 */
export enum EventKey {
    CLICK = "click",
    POINTER_MOVE = "pointermove",
    POINTER_DOWN = "pointerdown",
    POINTER_UP = "pointerup",
    DOUBLE_CLICK = "double-click",
    ZOOM_START = "zoom-start",
    ZOOM_END = "zoom-end",
    PITCH_START = "pitch-start",
    PITCH_END = "pitch-end",
    ROLL_START = "roll-start",
    ROLL_END = "roll-end",
}

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

/**
 * 事件基类
 * 所有事件都继承自此基类
 */
export interface IBaseEvent {
    type: string;
}
/**
 * 指针事件
 */
export interface IPointerEvent extends IBaseEvent {
    type: MapEventType;
    pointer: Vector2;
}
