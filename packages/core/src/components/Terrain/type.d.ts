export interface ITerrainOptions extends MapEngine.IBaseComponentOptions {
    /**
     * 地形颜色
     */
    color: number;
    /**
     * 地形宽度
     */
    width: number;
    /**
     * 地形高度
     */
    height: number;
    /**
     * 地形深度
     */
    depth: number;
    /**
     * 地形平面宽度分段
     */
    widthSegments: number;
    /**
     * 地形平面高度分段
     */
    heightSegments: number;
}
