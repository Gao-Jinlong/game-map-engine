import { IBounds, IBoundsTuple, IPosition } from "@core/interfaces/ICoord";
import { Position } from "./Position";

export class Bounds implements IBounds {
    minX: number;
    minY: number;
    minZ: number;
    maxX: number;
    maxY: number;
    maxZ: number;
    private _min: IPosition;
    private _max: IPosition;
    constructor(bounds: IBoundsTuple) {
        this.minX = bounds[0];
        this.minY = bounds[1];
        this.minZ = bounds[2];
        this.maxX = bounds[3];
        this.maxY = bounds[4];
        this.maxZ = bounds[5];

        this._min = new Position(this.minX, this.minY, this.minZ);
        this._max = new Position(this.maxX, this.maxY, this.maxZ);
    }
    static fromPositions(min: IPosition, max: IPosition) {
        return new Bounds([min.x, min.y, min.z, max.x, max.y, max.z]);
    }

    clone(): IBounds {
        return new Bounds([
            this.minX,
            this.minY,
            this.minZ,
            this.maxX,
            this.maxY,
            this.maxZ,
        ]);
    }

    get max() {
        return this._max;
    }
    get min() {
        return this._min;
    }
    get rangeX() {
        return this.maxX - this.minX;
    }
    get rangeY() {
        return this.maxY - this.minY;
    }
    get rangeZ() {
        return this.maxZ - this.minZ;
    }
}
