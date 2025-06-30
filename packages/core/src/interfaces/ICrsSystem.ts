import { ISystem } from "./ISystem";
import { ICoord, IPosition } from "./ICoord";
import { ITerrain } from "@core/layers";
export interface ICrsSystem extends ISystem {
    coordToPoint(coord: ICoord, zoom: number): IPosition;
    pointToCoord(position: IPosition, terrain?: ITerrain): ICoord;
}
