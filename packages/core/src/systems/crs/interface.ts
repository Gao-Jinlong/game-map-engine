import { ICoord, IPosition } from "@core/interfaces/ICoord";

export interface ICRS {
    coordToPoint(coord: ICoord, zoom: number): IPosition;
    pointToCoord(position: IPosition, zoom: number): ICoord;
}
