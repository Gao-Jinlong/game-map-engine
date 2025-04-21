import { IMap, IMapState } from "@core/interfaces";
import { ICrsSystem } from "@core/interfaces/ICRSSystem";

/**
 * 坐标系系统
 *
 * 屏幕坐标与空间坐标转换
 */
export class CrsSystem implements ICrsSystem {
    constructor(public context: IMap) {
        // TODO 坐标映射
    }
    init?: (() => void) | undefined;
    public project(lng: number, lat: number): { x: number; y: number } {
        return { x: 0, y: 0 };
    }
    public unproject(x: number, y: number): { lng: number; lat: number } {
        return { lng: 0, lat: 0 };
    }
    resize?: ((state: IMapState) => void) | undefined;
    destroy?: (() => void) | undefined;
}
