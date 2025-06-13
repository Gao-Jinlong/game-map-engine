import { Bounds } from "@core/entity/Bounds";
import { Simple } from "../projection";
import { Transformation } from "../projection/Transformation";
import { CRS } from "./CRS";
import { IBoundsTuple, ICoord } from "@core/interfaces/ICoord";
import { toDefaulted } from "es-toolkit/compat";

export interface ICartesianOptions {
    bounds: IBoundsTuple;
}
/**
 * 笛卡尔坐标系
 */
export class Cartesian extends CRS {
    infinite: boolean = true;

    private _options: ICartesianOptions;
    constructor(options?: Partial<ICartesianOptions>) {
        const finalOptions = toDefaulted(options ?? {}, {
            bounds: [
                -Infinity,
                -Infinity,
                -Infinity,
                Infinity,
                Infinity,
                Infinity,
            ],
        });

        super(
            new Simple({ bounds: new Bounds(finalOptions.bounds) }),
            new Transformation(1, 0, 1, 0, 1, 0)
        );

        this._options = finalOptions;
    }
    get options() {
        return this._options;
    }
    scale(zoom: number) {
        return 2 ** zoom;
    }

    zoom(scale: number) {
        return Math.log(scale) / Math.LN2;
    }

    distance(coord1: ICoord, coord2: ICoord) {
        const dx = coord2.lon - coord1.lon,
            dy = coord2.lat - coord1.lat,
            dz = coord2.alt - coord1.alt;

        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
}
