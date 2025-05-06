/**
 * 生命周期事件
 */
export const LifeCycleKey = {
    RESIZE: "resize",
    PRE_FRAME: "preFrame",
    POST_FRAME: "postFrame",
    /**
     * 地图初始化完成事件
     */
    ON_READY: "onReady",
} as const;

/**
 * 用户交互事件
 *
 * TODO 可能需要在 interaction System 定义，而不是这里
 */
export const EventType = {
    /**
     * 点击事件
     */
    CLICK: "click",
    /**
     * 通用更改事件
     */
    CHANGE: "change",
    /**
     * 鼠标移动事件
     */
    POINTER_MOVE: "pointerMove",
} as const;
