import { IMap, IMapState, ISystem } from "@core/interfaces";

/**
 * 地形系统
 *
 * 注册所有地形组件，并管理鼠标事件中的屏幕坐标到世界坐标的转换
 */
export class TerrainSystem implements ISystem {
    public context?: IMap;
    constructor() {}
    resize?: ((state: IMapState) => void) | undefined;
    destroy?: (() => void) | undefined;

    init() {}
}
