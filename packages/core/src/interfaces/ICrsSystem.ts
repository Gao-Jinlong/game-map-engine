import { ISystem } from "./ISystem";
import { ICoord, IPosition } from "./ICoord";
import { ITerrain } from "@core/layers";
import { Coord, Point } from "@core/entity";
export interface ICrsSystem extends ISystem {
    coordToPoint(coord: ICoord, zoom: number): IPosition;
    pointToCoord(position: Point, terrain?: ITerrain): Coord;
}
