import { ISystem } from "./ISystem";
import { ICoord, IPosition } from "./ICoord";

export interface ICrsSystem extends ISystem {
    project(coord: ICoord): IPosition;
    unproject(position: IPosition): ICoord;
}
