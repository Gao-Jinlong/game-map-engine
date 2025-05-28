/**
 * 引擎生命周期
 */
export enum LifeCycleType {
    RESIZE = "resize",
    PRE_FRAME = "preFrame",
    POST_FRAME = "postFrame",
    /**
     * 初始化完成
     */
    ON_READY = "onReady",
}

/**
 * 指针事件类型
 */
export enum PointerEventTypeEnum {
    TAP = "tap",
    DOUBLE_TAP = "doubleTap",
    POINTER_DOWN = "pointerDown",
    POINTER_MOVE = "pointerMove",
    POINTER_UP = "pointerUp",
}

/**
 * 键盘事件类型
 */
export enum KeyboardEventTypeEnum {
    KEY_DOWN = "keyDown",
    KEY_UP = "keyUp",
}

export type EventType =
    | LifeCycleType
    | PointerEventTypeEnum
    | KeyboardEventTypeEnum
    | string;
