import {
    IBaseComponentOptions,
    IComponent,
    Vector3Tuple,
} from "@core/interfaces";

export interface IMarkerOptions extends IBaseComponentOptions {
    /** 标记物位置 */
    position: Vector3Tuple;
    /** 标记物旋转 */
    rotation: Vector3Tuple;
    /** 标记物缩放 */
    scale: Vector3Tuple;
    /** 图标URL（可选，如果不提供则使用默认样式） */
    iconUrl: string;
    /** 悬停时的图标URL（可选，如果不提供则不切换纹理） */
    hoverIconUrl?: string;
    /** 标记物大小（默认为1） */
    size: number;
    /** 悬停时的标记物大小（可选，如果不提供则使用默认size） */
    hoverSize?: number;
    /** 标记物颜色（当没有iconUrl时使用，默认为白色） */
    color: number;
    /** 悬停时的颜色（可选） */
    hoverColor?: number;
    /** 是否可交互（默认为true） */
    interactive: boolean;
    /** 透明度（0-1，默认为1） */
    opacity: number;
    /** 悬停时的透明度（可选） */
    hoverOpacity?: number;
    /** 是否始终面向相机（默认为true） */
    billboard: boolean;
    /** 动画持续时间（毫秒，默认为300） */
    animationDuration?: number;
    /** 动画缓动函数类型 */
    animationEasing?: "linear" | "easeInOut" | "easeIn" | "easeOut";
    /** 点击事件回调 */
    onClick: (marker: any) => void;
    /** 鼠标悬停事件回调 */
    onHover: (marker: any, isHovering: boolean) => void;
}

export interface IMarker extends IComponent {}
