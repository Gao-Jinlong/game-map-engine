import { IMap } from "@core/interfaces";
import { Interactable } from "../../components/events/Interactable";
import { EventTarget, PointerEvent } from "@core/events";
import { IInteraction } from "./interface";
import Disposable from "@core/components/Disposable";
import { MarkerSystem } from "../markerSystem";
import { Vector2 } from "three";

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
    /**
     * 延迟 dispatch TAP 事件的定时器
     * 用于判定是否是双击事件
     */
    private doubleTapTimer: ReturnType<typeof setTimeout> | null = null;

    /** 当前交互的元素 */
    public interactable: Interactable | null = null;
    /** 当前交互的元素 */
    public target: EventTarget;
    /** 上一个事件对象 */
    public previousTapEvent: PointerEvent | null = null;
    /** 地图上下文 */
    private context?: IMap;
    /** 当前悬停的 Marker */
    private hoveredMarker: any = null;

    constructor(target: EventTarget) {
        super();
        this.target = target;
        // 如果 target 是 Map 实例，保存上下文
        if ("systemManager" in target) {
            this.context = target as IMap;
        }
    }

    pointerDown(event: PointerEvent) {
        this.target.dispatchEvent(event);
    }

    pointerMove(event: PointerEvent) {
        // 处理 Marker 悬停事件
        if (this.context) {
            const markerSystem =
                this.context.systemManager.getSystem(MarkerSystem);
            const screenPoint = this.getScreenPoint(event);
            const hoveredMarker = markerSystem.handleMarkerHover(screenPoint);

            // 如果悬停的 Marker 发生变化
            if (hoveredMarker !== this.hoveredMarker) {
                // 触发之前悬停 Marker 的离开事件
                if (this.hoveredMarker) {
                    this.hoveredMarker.handleHover(false);
                }

                // 触发新 Marker 的悬停事件
                if (hoveredMarker) {
                    hoveredMarker.handleHover(true);
                }

                this.hoveredMarker = hoveredMarker;
            }
        }

        this.target.dispatchEvent(event);
    }

    pointerUp(event: PointerEvent) {
        this.target.dispatchEvent(event);
    }

    tap(event: PointerEvent) {
        this.previousTapEvent = event;
        this.doubleTapTimer = setTimeout(() => {
            // 在处理普通事件之前，先检查是否点击了 Marker
            const markerHandled = this.handleMarkerTap(event);

            // 如果没有 Marker 被点击，则继续处理普通事件
            if (!markerHandled) {
                this.target.dispatchEvent(event);
            }

            this.doubleTapTimer = null;
        }, PointerEvent.DOUBLE_TAP_INTERVAL);
    }

    doubleTap(event: PointerEvent) {
        this.doubleTapTimer && clearTimeout(this.doubleTapTimer);
        this.doubleTapTimer = null;

        // 处理双击事件，也检查 Marker
        const markerHandled = this.handleMarkerTap(event);

        if (!markerHandled) {
            this.target.dispatchEvent(event);
        }
    }

    /**
     * 处理 Marker 点击事件
     */
    private handleMarkerTap(event: PointerEvent): boolean {
        if (!this.context) {
            return false;
        }

        const markerSystem = this.context.systemManager.getSystem(MarkerSystem);
        const screenPoint = this.getScreenPoint(event);

        return markerSystem.handleMarkerClick(screenPoint);
    }

    /**
     * 将事件坐标转换为标准化的屏幕坐标
     */
    private getScreenPoint(event: PointerEvent): Vector2 {
        if (!this.context) {
            return new Vector2(0, 0);
        }

        const rect = this.context.container.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        return new Vector2(x, y);
    }

    disposeInternal(): void {
        // 清理悬停状态
        if (this.hoveredMarker) {
            this.hoveredMarker.handleHover(false);
            this.hoveredMarker = null;
        }

        this.doubleTapTimer && clearTimeout(this.doubleTapTimer);
        this.doubleTapTimer = null;
    }
}

export default Interaction;
