import { ISystem } from "./ISystem";
import { ICoord, IPosition } from "./ICoord";

export interface ICrsSystem extends ISystem {
    coordToPoint(coord: ICoord, zoom: number): IPosition;
    pointToCoord(position: IPosition, zoom: number): ICoord;
}
