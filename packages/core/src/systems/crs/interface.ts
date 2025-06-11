import { ICoord, IPosition } from "@core/interfaces/ICoord";

export interface ICRS {
    coordToPosition(coord: ICoord, zoom: number): IPosition;
    positionToCoord(position: IPosition, zoom: number): ICoord;
}
