import {
    IBaseComponentOptions,
    IComponent,
    Vector3Tuple,
} from "@core/interfaces";
import { IVariant } from "@core/interfaces/Animation";

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
    /** 标记物颜色（当没有iconUrl时使用，默认为白色） */
    color: number;
    /** 是否可交互（默认为true） */
    interactive: boolean;
    /** 透明度（0-1，默认为1） */
    opacity: number;
    /** 是否始终面向相机（默认为true） */
    billboard: boolean;
    variants: IVariant[];
    /** 点击事件回调 */
    onClick: (marker: any) => void;
    /** 鼠标悬停事件回调 */
    onHover: (marker: any, isHovering: boolean) => void;
}

export interface IMarker extends IComponent<IMarkerOptions> {
    handleClick(): void;
    handleHover(isHovering: boolean): void;
    /** 获取标记物对象（用于射线检测等） */
    getObject3D(): THREE.Object3D | undefined;
}
