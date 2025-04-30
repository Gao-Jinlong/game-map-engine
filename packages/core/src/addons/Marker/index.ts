import { BaseComponent } from "../BaseComponent";
import { IMarkerOptions } from "./type";

export class Marker extends BaseComponent<IMarkerOptions> {
    constructor(options: IMarkerOptions) {
        super(options);
    }
    onAdd(): void {
        throw new Error("Method not implemented.");
    }
    onUpdate?(): void {
        throw new Error("Method not implemented.");
    }
    onRemove?(): void {
        throw new Error("Method not implemented.");
    }
    onResize?(): void {
        throw new Error("Method not implemented.");
    }
}
