/**
 * 经过投影后变换后的坐标系中的坐标
 */
export interface ICoord {
    lon: number;
    lat: number;
    alt: number;
    tuple: ICoordTuple;
    clone(): ICoord;
}

export type ICoordTuple = [number, number, number];

/**
 * 原始数据的空间位置
 */
export interface IPosition {
    x: number;
    y: number;
    z: number;
    tuple: IPositionTuple;
    clone(): IPosition;
}

export type IPositionTuple = [number, number, number];

export interface IBounds {
    minX: number;
    minY: number;
    minZ: number;
    maxX: number;
    maxY: number;
    maxZ: number;
}

export type IBoundsTuple = [number, number, number, number, number, number];
