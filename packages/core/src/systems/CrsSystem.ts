import { IMap, IMapState } from "@core/interfaces";
import { ICrsSystem } from "@core/interfaces/ICrsSystem";
import { CRS } from "./crs/CRS";
import { Cartesian } from "./crs/Cartesian";
import { toDefaulted } from "es-toolkit/compat";
import {
    ICoord,
    ICoordTuple,
    IPosition,
    IPositionTuple,
} from "@core/interfaces/ICoord";
import { Coord, isCoord, Position, isPosition } from "@core/entity";

export interface ICrsOptions {
    crs: CRS;
}
/**
 * 坐标系系统
 */
export class CrsSystem implements ICrsSystem {
    crs?: CRS;
    private _options?: ICrsOptions;
    constructor(public context: IMap) {
        // TODO: 屏幕坐标与空间坐标的转换计算
    }
    init(options?: Partial<ICrsOptions>): void {
        const finalOptions = toDefaulted(options ?? {}, {
            crs: new Cartesian(),
        });

        this.crs = finalOptions.crs;
        this._options = finalOptions;
    }
    get options() {
        return this._options;
    }
    public coordToPosition(
        coordLike: ICoordTuple | ICoord,
        zoom: number
    ): IPosition {
        const coord = isCoord(coordLike) ? coordLike : new Coord(...coordLike);
        return this.crs!.coordToPosition(coord, zoom);
    }
    public positionToCoord(
        positionLike: IPosition | IPositionTuple,
        zoom: number
    ): ICoord {
        const position = isPosition(positionLike)
            ? positionLike
            : new Position(...positionLike);
        return this.crs!.positionToCoord(position, zoom);
    }
    resize?: ((state: IMapState) => void) | undefined;
    destroy?: (() => void) | undefined;
}
