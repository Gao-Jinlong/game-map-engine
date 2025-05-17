import { IMap } from "@core/interfaces";
import { Interactable } from "../../components/events/Interactable";

/**
 * pointer 交互系统
 *
 * 接受被 EventCaptureSystem 捕获的 PointerEvent 事件序列 \
 * 对事件序列进行解析，判断交互类型 \
 * 如：拖拽、双击等 \
 * 在交互事件的不同阶段 fire 不同的交互事件到监听器 \
 * 如：onPointerDown、onPointerMove、onPointerUp 等
 */
export class Interaction {
    /** 当前交互的元素 */
    interactable: Interactable | null = null;
    public context: IMap;
    constructor(context: IMap) {
        this.context = context;
    }

    pointerDown(event: PointerEvent) {
        console.log("pointerDown", event);
    }
    pointerMove(event: PointerEvent) {
        console.log("pointerMove", event);
    }
    pointerUp(event: PointerEvent) {
        console.log("pointerUp", event);
    }
}

export default Interaction;
