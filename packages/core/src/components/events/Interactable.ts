import { toDefaulted } from "es-toolkit/compat";
import { Options } from "./options";
import { EventTarget } from "./EventTarget";

/**
 * 可交互元素组件
 *
 * 承载交互所需的配置，和统一交互元素的数据接口
 */
export class Interactable extends EventTarget {
    public options: Required<Options>;
    constructor(options: Partial<Options>) {
        super();

        this.options = toDefaulted(options, {
            preventDefault: "auto",
        });
    }

    getRect() {
        return {
            top: 0,
            left: 0,
            bottom: 0,
        };
    }
    disposeInternal() {
        super.disposeInternal();
    }
}
