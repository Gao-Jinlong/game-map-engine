import { IMap } from "@core/interfaces";
import { Interactable } from "../../components/events/Interactable";
import { EventTarget, PointerEvent } from "@core/events";
import { IInteraction } from "./interface";
import Disposable from "@core/components/Disposable";

/**
 * pointer 交互系统
 *
 * 接受被 EventCaptureSystem 捕获的 PointerEvent 事件序列 \
 * 对事件序列进行解析，判断交互类型 \
 * 如：拖拽、双击等 \
 * 在交互事件的不同阶段 fire 不同的交互事件到监听器 \
 * 如：onPointerDown、onPointerMove、onPointerUp 等
 *
 * 后续对于多点触控可能需要使用多个 Interaction 实现，现在暂时不考虑
 */
export class Interaction extends Disposable implements IInteraction {
    private timer: ReturnType<typeof setTimeout> | null = null;

    /** 当前交互的元素 */
    public interactable: Interactable | null = null;
    /** 当前交互的元素 */
    public target: EventTarget;
    /** 上一个事件对象 */
    public previousTapEvent: PointerEvent | null = null;
    constructor(target: EventTarget) {
        super();
        this.target = target;
    }

    pointerDown(event: PointerEvent) {
        this.target.dispatchEvent(event);
    }
    pointerMove(event: PointerEvent) {
        this.target.dispatchEvent(event);
    }
    pointerUp(event: PointerEvent) {
        this.target.dispatchEvent(event);
    }
    tap(event: PointerEvent) {
        this.previousTapEvent = event;
        this.timer = setTimeout(() => {
            this.target.dispatchEvent(event);
            this.timer = null;
        }, PointerEvent.DOUBLE_TAP_INTERVAL);
    }
    doubleTap(event: PointerEvent) {
        this.timer && clearTimeout(this.timer);
        this.timer = null;

        this.target.dispatchEvent(event);
    }

    disposeInternal(): void {
        this.timer && clearTimeout(this.timer);
        this.timer = null;
    }
}

export default Interaction;
