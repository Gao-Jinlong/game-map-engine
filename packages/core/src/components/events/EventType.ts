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

export type EventType = LifeCycleType | PointerEventTypeEnum | string;
