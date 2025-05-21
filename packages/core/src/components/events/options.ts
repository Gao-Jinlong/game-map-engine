import type { Point, Listeners, OrBoolean, Element, Rect } from "./types";

export interface BaseDefaults {
    preventDefault?: "always" | "never" | "auto";
}

export interface PerActionDefaults {
    enabled?: boolean;
    origin?: Point | string | Element;
    listeners?: Listeners;
    allowFrom?: string | Element;
    ignoreFrom?: string | Element;
}

export type Options = Partial<BaseDefaults>;
