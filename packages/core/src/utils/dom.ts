import { IPointerEvent } from "@core/components/events/types";
import { Point } from "@core/entity/Point";

type ScaleReturnValue = {
    x: number;
    y: number;
    boundingClientRect: DOMRect;
};

export class DOM {
    public static mousePos(el: HTMLElement, e: IPointerEvent): Point {
        const scale = DOM.getScale(el);
        return DOM.getPoint(el, scale, e);
    }

    private static getScale(element: HTMLElement): ScaleReturnValue {
        const rect = element.getBoundingClientRect();
        return {
            x: rect.width / element.offsetWidth || 1,
            y: rect.height / element.offsetHeight || 1,
            boundingClientRect: rect,
        };
    }
    private static getPoint(
        el: HTMLElement,
        scale: ScaleReturnValue,
        e: MouseEvent | Touch
    ): Point {
        const rect = scale.boundingClientRect;
        return new Point(
            // rect.left/top values are in page scale (like clientX/Y),
            // whereas clientLeft/Top (border width) values are the original values (before CSS scale applies).
            (e.clientX - rect.left) / scale.x - el.clientLeft,
            (e.clientY - rect.top) / scale.y - el.clientTop
        );
    }
}
