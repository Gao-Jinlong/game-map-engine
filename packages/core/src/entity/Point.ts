import { Vector2, Vector3 } from "three";

export class Point {
    constructor(public x: number, public y: number) {
        this.x = x ?? 0;
        this.y = y ?? 0;
    }

    toVector2(): Vector2 {
        return new Vector2(this.x, this.y);
    }
    toVector3(): Vector3 {
        return new Vector3(this.x, this.y, 0);
    }
}
