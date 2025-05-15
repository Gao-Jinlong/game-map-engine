import { InteractEvent } from "@core/components/events/InteractEvent";
import { PointerEventType, PointerType } from "@core/components/events/types";

export function isPointerEvent(event: unknown): event is PointerEventType {
    return (
        event instanceof MouseEvent ||
        event instanceof TouchEvent ||
        event instanceof InteractEvent
    );
}
