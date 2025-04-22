import { IBounds, IBoundsTuple } from "@core/interfaces/ICoord";

export class Bounds implements IBounds {
    minX: number;
    minY: number;
    minZ: number;
    maxX: number;
    maxY: number;
    maxZ: number;
    constructor(bounds: IBoundsTuple) {
        this.minX = bounds[0];
        this.minY = bounds[1];
        this.minZ = bounds[2];
        this.maxX = bounds[3];
        this.maxY = bounds[4];
        this.maxZ = bounds[5];
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
}
