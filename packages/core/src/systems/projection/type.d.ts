import { Coord } from "@core/interfaces";
import {
    IBounds,
    ICoord,
    IPosition,
    IPositionTuple,
} from "@core/interfaces/ICoord";
import { Vector3Like } from "three";

export interface IProjection {
    /**
     * 将坐标还原到原始空间
     */
    project(coord: ICoord): IPosition;
    /**
     * 将坐标投影到地图空间
     */
    unproject(position: IPosition): Coord;
    /**
     * 空间范围（投影前）
     */
    bounds: IBounds;
}
