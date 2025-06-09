import { IBaseComponentOptions } from "@core/interfaces";

export interface IImageLayerOptions extends IBaseComponentOptions {
    /**
     * 图片路径
     */
    src: string;
    /**
     * 图片宽度
     */
    width?: number;
    /**
     * 图片高度
     */
    height?: number;
    /**
     * 图片平面高度
     */
    elevation: number;
    /**
     * 图片平面宽度分段
     */
    widthSegments: number;
    /**
     * 图片平面高度分段
     */
    heightSegments: number;
    /**
     * 图片平面位移
     */
    displacementSrc: string;
    /**
     * 图片平面位移
     */
    displacementScale: number;
    /**
     * AO图路径
     */
    aoSrc: string;
    /**
     * AO强度
     */
    aoIntensity: number;
    /**
     * 蒙版图路径
     */
    maskSrc?: string;
}
