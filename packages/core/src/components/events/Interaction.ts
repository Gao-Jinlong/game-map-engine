import { Interactable } from "./Interactable";

/**
 * 交互组件
 *
 * 承载交互事件的上下文，并负责处理复杂的交互逻辑  \
 * 如：拖拽、双击等
 */
export class Interaction {
    /** 当前交互的元素 */
    interactable: Interactable | null = null;
}

export default Interaction;
