import extend from "@interactjs/utils/extend";
import getOriginXY from "@interactjs/utils/getOriginXY";
import hypot from "@interactjs/utils/hypot";

import type {
    Point,
    FullRect,
    PointerEventType,
    Element,
    ActionName,
} from "./types";

import { BaseEvent } from "./BaseEvent";
import type { Interaction } from "./Interaction";
import { defaults } from "./options";

export type EventPhase = keyof PhaseMap;

export interface PhaseMap {
    start: true;
    move: true;
    end: true;
}

// defined outside of class definition to avoid assignment of undefined during
// construction
export interface InteractEvent {
    pageX: number;
    pageY: number;

    clientX: number;
    clientY: number;

    dx: number;
    dy: number;

    velocityX: number;
    velocityY: number;
}

/**
 * 指针交互事件
 */
export class InteractEvent extends BaseEvent {
    declare target: EventTarget;
    declare currentTarget: EventTarget;
    relatedTarget: Element | null = null;
    screenX?: number;
    screenY?: number;
    ctrlKey: boolean;
    shiftKey: boolean;
    altKey: boolean;
    metaKey: boolean;
    page: Point;
    client: Point;
    delta: Point;
    rect: FullRect;
    x0: number;
    y0: number;
    t0: number;
    dt: number;
    duration: number;
    clientX0: number;
    clientY0: number;
    velocity: Point;
    speed: number;
    swipe: ReturnType<InteractEvent>;
    // resize
    axes?: "x" | "y" | "xy";
    /** @internal */
    preEnd?: boolean;

    constructor() {
        super();
    }
}
