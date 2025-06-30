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
import { ITerrain } from "@core/layers";
import { Point } from "@core/entity/Point";
import { Raycaster } from "three";

export interface ICrsOptions {
    crs: CRS;
}
/**
 * 坐标系系统
 */
export class CrsSystem implements ICrsSystem {
    crs?: CRS;
    private _options?: ICrsOptions;
    private rayCaster: Raycaster;
    constructor(public context: IMap) {
        this.rayCaster = new Raycaster();
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
    public coordToPoint(coordLike: Coord, zoom: number): IPosition {
        const coord = isCoord(coordLike) ? coordLike : new Coord(...coordLike);
        return this.crs!.coordToPoint(coord, zoom);
    }
    public pointToCoord(point: Point, terrain?: ITerrain): Coord {
        if (terrain) {
            const coordinate = terrain.pointToCoord(point);
            if (coordinate != null) {
                return coordinate;
            }
        }

        return this.screenPointToCoordAtZ(point);
    }

    private screenPointToCoordAtZ(p: Point, mercatorZ?: number): Coord {
        this.context.systemManager.getSystem();
    }
    resize?: ((state: IMapState) => void) | undefined;
    destroy?: (() => void) | undefined;
}
