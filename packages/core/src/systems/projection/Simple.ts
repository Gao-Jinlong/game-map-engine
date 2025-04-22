import { IBounds, ICoord, IPosition } from "@core/interfaces/ICoord";
import { Coord, Position } from "@core/entity";
import { IProjection } from "./type";

export interface ISimpleProjectionOptions {
    bounds: IBounds;
}
/**
 * 简单投影
 */
export class Simple implements IProjection {
    bounds: IBounds;
    constructor({ bounds }: { bounds: IBounds }) {
        this.bounds = bounds;
    }
    project(coord: ICoord): IPosition {
        return new Position(coord.lon, coord.lat, coord.alt);
    }
    unproject(position: IPosition): ICoord {
        return new Coord(position.x, position.y, position.z);
    }
}
