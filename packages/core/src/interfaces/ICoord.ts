import { Vector3Tuple } from "./Vector";

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

export type ICoordTuple = Vector3Tuple;

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

export type IPositionTuple = Vector3Tuple;

export interface IBounds {
    minX: number;
    minY: number;
    minZ: number;
    maxX: number;
    maxY: number;
    maxZ: number;
    rangeX: number;
    rangeY: number;
    rangeZ: number;
    min: IPosition;
    max: IPosition;
    clone(): IBounds;
}

export type IBoundsTuple = [number, number, number, number, number, number];
