import { Position } from "@core/entity";
import { IPosition } from "@core/interfaces/ICoord";

/**
 * 仿射变换接口
 * 定义了三维空间中的仿射变换方法
 */
export interface ITransformation {
    /**
     * 对点进行仿射变换
     * @param point - 要变换的点
     * @param scale - 可选的缩放因子
     * @returns 变换后的点
     */
    transform(point: IPosition, scale?: number): IPosition;

    /**
     * 对点进行反向仿射变换
     * @param point - 要反向变换的点
     * @param scale - 可选的缩放因子
     * @returns 反向变换后的点
     */
    untransform(point: IPosition, scale?: number): IPosition;
}

/**
 * 仿射变换类
 * 实现三维空间中的仿射变换，支持平移、缩放
 * 变换公式：
 * x' = a * x + b
 * y' = c * y + d
 * z' = e * z + f
 */
export class Transformation implements ITransformation {
    private _a: number; // X轴缩放系数
    private _b: number; // X轴平移系数
    private _c: number; // Y轴缩放系数
    private _d: number; // Y轴平移系数
    private _e: number; // Z轴缩放系数
    private _f: number; // Z轴平移系数

    /**
     * 创建仿射变换实例
     * @param a - X轴缩放系数或变换系数数组
     * @param b - X轴平移系数
     * @param c - Y轴缩放系数
     * @param d - Y轴平移系数
     * @param e - Z轴缩放系数
     * @param f - Z轴平移系数
     */
    constructor(
        a: number | number[],
        b?: number,
        c?: number,
        d?: number,
        e?: number,
        f?: number
    ) {
        if (Array.isArray(a)) {
            // 使用数组参数
            this._a = a[0];
            this._b = a[1];
            this._c = a[2];
            this._d = a[3];
            this._e = a[4];
            this._f = a[5];
            return;
        }
        this._a = a;
        this._b = b!;
        this._c = c!;
        this._d = d!;
        this._e = e!;
        this._f = f!;
    }

    /**
     * 对点进行仿射变换
     * @param point - 要变换的点
     * @param scale - 可选的缩放因子
     * @returns 变换后的点
     */
    transform(point: IPosition, scale?: number): IPosition {
        return this._transform(point.clone(), scale);
    }

    /**
     * 内部使用的变换方法，会修改原始点
     * @param point - 要变换的点
     * @param scale - 可选的缩放因子
     * @returns 变换后的点
     */
    private _transform(point: IPosition, scale?: number): IPosition {
        scale = scale ?? 1;
        point.x = scale * (this._a * point.x + this._b);
        point.y = scale * (this._c * point.y + this._d);
        point.z = scale * (this._e * point.z + this._f);
        return point;
    }

    /**
     * 对点进行反向仿射变换
     * @param point - 要反向变换的点
     * @param scale - 可选的缩放因子
     * @returns 反向变换后的点
     */
    untransform(point: IPosition, scale?: number): IPosition {
        scale = scale ?? 1;
        return new Position(
            (point.x / scale - this._b) / this._a,
            (point.y / scale - this._d) / this._c,
            (point.z / scale - this._f) / this._e
        );
    }
}
