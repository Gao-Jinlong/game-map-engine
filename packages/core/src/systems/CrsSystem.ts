import { ICameraSystem, IMap, IMapState } from "@core/interfaces";
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
import { PerspectiveCamera, Plane, Raycaster, Vector2, Vector3 } from "three";
import { CameraSystem } from "./CameraSystem";

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
    private camera?: PerspectiveCamera;
    constructor(public context: IMap) {
        this.rayCaster = new Raycaster();
        this.point = new Vector2();
    }
    init(options?: Partial<ICrsOptions>): void {
        const finalOptions = toDefaulted(options ?? {}, {
            crs: new Cartesian(),
        });

        this.crs = finalOptions.crs;
        this._options = finalOptions;
        this.camera = this.context.systemManager.getSystem(CameraSystem).camera;
    }
    get options() {
        return this._options;
    }
    public coordToPoint(coordLike: Coord, zoom: number): IPosition {
        const coord = isCoord(coordLike) ? coordLike : new Coord(...coordLike);

        return this.crs!.coordToPoint(coord, zoom);
    }
    public pointToCoord(point: Point, terrain?: ITerrain): Coord {
        if (!this.camera) {
            throw new Error("camera is not initialized");
        }

        this.rayCaster.setFromCamera(point.toVector2(), this.camera);

        if (terrain) {
            const coordinate = terrain.pointToCoord(point);
            if (coordinate != null) {
                return coordinate;
            }
        }
        // TODO 屏幕坐标转世界坐标
        return this.screenPointToCoordAtZ(point);
    }

    private screenPointToCoordAtZ(p: Point, z?: number) {
        const plane = z
            ? new Plane(new Vector3(0, 0, 1), z)
            : this.context.seaLevel;

        const intersects = this.rayCaster.ray.intersectPlane(
            plane,
            p.toVector3()
        );

        return intersects
            ? new Coord(intersects.x, intersects.y, intersects.z)
            : new Coord(0, 0, 0);
    }
    resize?: ((state: IMapState) => void) | undefined;
    destroy?: (() => void) | undefined;
}
