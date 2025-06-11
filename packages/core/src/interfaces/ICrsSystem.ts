import { ISystem } from "./ISystem";
import { ICoord, IPosition } from "./ICoord";

export interface ICrsSystem extends ISystem {
    coordToPosition(coord: ICoord, zoom: number): IPosition;
    positionToCoord(position: IPosition, zoom: number): ICoord;
}
