/**
 * 引擎生命周期
 */
export const LifeCycleKey = {
    RESIZE: "resize",
    PRE_FRAME: "preFrame",
    POST_FRAME: "postFrame",
    /**
     * 初始化完成
     */
    ON_READY: "onReady",
} as const;

/**
 * 引擎事件
 */
export enum MapEventType {
    CLICK = "click",
    POINTER_MOVE = "pointerMove",
    DOUBLE_CLICK = "doubleClick",

    CHANGE = "change",
}
