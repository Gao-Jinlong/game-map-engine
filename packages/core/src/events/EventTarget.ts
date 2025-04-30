import Disposable from "@core/components/Disposable";
import { BaseEvent } from "./BaseEvent";

export type Listener = (event: BaseEvent) => void;
/**
 * @classdesc
 * A simplified implementation of the W3C DOM Level 2 EventTarget interface.
 * See https://www.w3.org/TR/2000/REC-DOM-Level-2-Events-20001113/events.html#Events-EventTarget.
 *
 * There are two important simplifications compared to the specification:
 *
 * 1. The handling of `useCapture` in `addEventListener` and
 *    `removeEventListener`. There is no real capture model.
 * 2. The handling of `stopPropagation` and `preventDefault` on `dispatchEvent`.
 *    There is no event target hierarchy. When a listener calls
 *    `stopPropagation` or `preventDefault` on an event object, it means that no
 *    more listeners after this one will be called. Same as when the listener
 *    returns false.
 */
class EventTarget extends Disposable {
    private eventTarget_: EventTarget;
    private pendingRemovals_: Map<string, number>;
    private dispatching_: Map<string, number>;
    private listeners_?: Map<string, Set<Listener>>;

    constructor(target: EventTarget) {
        super();

        this.eventTarget_ = target;
        this.pendingRemovals_ = new Map();
        this.dispatching_ = new Map();
        this.listeners_ = new Map();
    }

    addEventListener(type: string, listener: Listener) {
        if (!type || !listener) {
            return;
        }
        const listeners = this.listeners_ || (this.listeners_ = new Map());
        const listenersForType =
            listeners.get(type) ||
            (listeners.set(type, new Set()), listeners.get(type));
        listenersForType.add(listener);
    }

    /**
     * Dispatches an event and calls all listeners listening for events
     * of this type. The event parameter can either be a string or an
     * Object with a `type` property.
     *
     * @param {import("./Event.js").default|string} event Event object.
     * @return {boolean|undefined} `false` if anyone called preventDefault on the
     *     event object or if any of the listeners returned false.
     * @api
     */
    dispatchEvent(event: BaseEvent) {
        const isString = typeof event === "string";
        const type = isString ? event : event.type;
        const listeners = this.listeners_ && this.listeners_.get(type);
        if (!listeners) {
            return;
        }

        const evt = isString
            ? new BaseEvent(event, this.eventTarget_ || this, event)
            : /** @type {Event} */ event;
        if (!evt.target) {
            evt.target = this.eventTarget_ || this;
        }
        const dispatching =
            this.dispatching_ || (this.dispatching_ = new Map());
        const pendingRemovals =
            this.pendingRemovals_ || (this.pendingRemovals_ = new Map());
        if (!dispatching.has(type)) {
            dispatching.set(type, 0);
            pendingRemovals.set(type, 0);
        }
        dispatching.set(type, dispatching.get(type) + 1);
        let propagate;
        for (const listener of listeners) {
            propagate = listener(evt);
            if (propagate === false || evt.propagationStopped) {
                break;
            }
        }
        if (--dispatching.get(type) === 0) {
            let pr = pendingRemovals.get(type) ?? 0;
            pendingRemovals.delete(type);
            while (pr--) {
                this.removeEventListener(type, () => void 0);
            }
            dispatching.delete(type);
        }
        return propagate;
    }

    disposeInternal() {
        this.listeners_?.clear();
    }

    getListeners(type: string) {
        return (this.listeners_ && this.listeners_.get(type)) || undefined;
    }

    hasListener(type: string) {
        if (!this.listeners_) {
            return false;
        }
        return type
            ? type in this.listeners_
            : Object.keys(this.listeners_).length > 0;
    }

    removeEventListener(type: string, listener: Listener) {
        if (!this.listeners_) {
            return;
        }
        const listeners = this.listeners_.get(type);
        if (!listeners?.size) {
            return;
        }
        listeners.delete(listener);
        if (!listeners.size) {
            this.listeners_.delete(type);
        }
    }
}

export default EventTarget;
