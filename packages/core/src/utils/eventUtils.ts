import { IPointerEvent } from "@core/components/events/types";

export function isPointerEvent(event: unknown): event is IPointerEvent {
    return event instanceof MouseEvent || event instanceof TouchEvent;
}
