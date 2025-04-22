import { IPosition, IPositionTuple } from "@core/interfaces/ICoord";

export class Position implements IPosition {
    constructor(public x: number, public y: number, public z: number) {}

    get tuple(): IPositionTuple {
        return [this.x, this.y, this.z];
    }

    clone(): IPosition {
        return new Position(this.x, this.y, this.z);
    }
}

export function isPosition(
    position: IPosition | IPositionTuple
): position is IPosition {
    return position instanceof Position;
}
