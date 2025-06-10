import { BaseComponent } from "../BaseComponent";
import { IMarker, IMarkerOptions } from "./interface";
import * as THREE from "three";
import { toDefaulted, uniqueId } from "es-toolkit/compat";
import gsap from "gsap";
import { IVariant } from "@core/interfaces/Animation";
import { merge } from "es-toolkit";

export const defaultTexture = (() => {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext("2d");
    if (context) {
        context.fillStyle = `#ffffff`;
        context.beginPath();
        context.arc(32, 32, 30, 0, 2 * Math.PI);
        context.fill();
    }
    return new THREE.CanvasTexture(canvas);
})();

const defaultVariants: Record<string, IVariant> = {
    normal: {
        name: "normal",
        size: 200,
        opacity: 1,
    },
    hover: {
        name: "hover",
        size: 200 * 1.2,
        opacity: 1,
    },
};

/**
 * TODO
 * 固定大小，不随地图缩放
 * 排除光照影响
 * 指针交互事件
 * popup 弹窗
 * 层级渲染不被其他物体遮挡
 */
export class Marker extends BaseComponent implements IMarker {
    #options: IMarkerOptions;
    private mesh?: THREE.Mesh;
    private geometry?: THREE.PlaneGeometry;
    private material?: THREE.MeshBasicMaterial;
    private texture?: THREE.Texture;
    private hoverTexture?: THREE.Texture;
    private loader?: THREE.TextureLoader;
    private sprite?: THREE.Sprite;
    private spriteMaterial?: THREE.SpriteMaterial;
    private hoverMaterial?: THREE.SpriteMaterial;

    private position: THREE.Vector3;
    private rotation: THREE.Vector3;
    private scale: THREE.Vector3;

    // 悬停状态和动画相关
    private isHovering: boolean = false;
    private currentVariant?: IVariant;
    private variants?: Map<string, IVariant>;

    constructor(options: Partial<IMarkerOptions>) {
        super();

        // 创建一个完整的选项对象，确保所有必需的属性都有值
        const completeOptions: IMarkerOptions = toDefaulted(options, {
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
            size: 1,
            variants: [
                {
                    name: "normal",
                    scale: 1 * 200,
                    opacity: 1,
                },
                {
                    name: "hover",
                    scale: 1.2 * 200, // TODO 目前地图中的比例尺未统一，这里临时写死大小，后续需要修改为相对大小
                    opacity: 1,
                },
            ],
            color: 0xffffff,
            interactive: true,
            opacity: 1,
            billboard: true,
            iconUrl: "",
            name: uniqueId("marker_"),
            animationDuration: 300,
            animationEasing: "easeInOut",
            onHover: () => {},
            onClick: () => {},
        });
        this.#options = completeOptions;

        this.position = new THREE.Vector3(...completeOptions.position);
        this.rotation = new THREE.Vector3(...completeOptions.rotation);
        this.scale = new THREE.Vector3(...completeOptions.scale);

        if (completeOptions.variants) {
            this.initVariants(completeOptions.variants);
        }
    }
    get options(): IMarkerOptions {
        return this.#options;
    }
    get interactive(): boolean {
        return this.#options.interactive ?? true;
    }

    private initVariants(variants: IVariant[]): void {
        this.variants = new Map(
            variants.map((variant) => [
                variant.name,
                merge(defaultVariants[variant.name], variant),
            ])
        );

        this.currentVariant = this.variants.get("normal");
    }

    onAdd(): void {
        this.createMarker();
        this.addToScene();
        this.setupInteraction();
        this.preloadHoverTexture();
    }

    onUpdate?(): void {
        if (this.mesh || this.sprite) {
            this.updateTransform();
        }
    }

    onRemove?(): void {
        this.removeFromScene();
        this.dispose();
    }

    onResize?(): void {
        // Marker 通常不需要在窗口大小改变时做特殊处理
        // 但如果需要保持屏幕大小不变，可以在这里实现
    }

    /**
     * 预加载悬停纹理
     */
    private preloadHoverTexture(): void {
        if (!this.options) return;

        const variant = this.variants?.get("hover");

        if (variant?.iconUrl) {
            this.loader = this.loader || new THREE.TextureLoader();
            this.hoverTexture = this.loader.load(
                variant.iconUrl,
                (texture) => {
                    console.log("Hover texture loaded successfully");
                },
                undefined,
                (error) => {
                    console.warn("Failed to load hover texture:", error);
                }
            );

            this.hoverMaterial = new THREE.SpriteMaterial({
                map: this.hoverTexture,
                transparent: true,
                opacity: variant.opacity,
            });
        }
    }

    /**
     * 创建标记物
     */
    private createMarker(): void {
        const variant = this.variants?.get("normal");
        if (!variant || !this.options) return;

        const { billboard } = this.options;
        const { iconUrl, size, opacity } = variant;

        if (iconUrl) {
            // 使用图片纹理创建标记
            this.createTexturedMarker(iconUrl, size, billboard, opacity!);
        }
        // else {
        //     // 使用默认几何体创建标记
        //     this.createDefaultMarker(size!, color!, billboard!, opacity!);
        // }
    }

    /**
     * 创建带纹理的标记物
     */
    private createTexturedMarker(
        iconUrl: string,
        size: number,
        billboard: boolean,
        opacity: number
    ): void {
        this.loader = this.loader || new THREE.TextureLoader();
        this.texture = this.loader.load(
            iconUrl,
            (texture) => {
                // 纹理加载完成后的回调
                this.updateMarkerSize(size);
            },
            undefined,
            (error) => {
                console.warn("Failed to load marker texture:", error);
                // 加载失败时使用默认标记
                this.createDefaultMarker(size, 0xff0000, billboard, opacity);
            }
        );

        if (billboard) {
            // 使用 Sprite 来创建始终面向相机的标记
            this.spriteMaterial = new THREE.SpriteMaterial({
                map: this.texture,
                transparent: true,
                alphaTest: 0.1,
                opacity: opacity,
            });

            this.sprite = new THREE.Sprite(this.spriteMaterial);
            this.sprite.scale.set(size, size, 1);

            // 设置用户数据，用于交互识别
            this.sprite.userData = {
                componentId: this.__component_id__,
                type: "marker",
                interactive: this.interactive,
                markerInstance: this,
            };
        } else {
            // 使用 Mesh 创建不面向相机的标记
            this.geometry = new THREE.PlaneGeometry(size, size);
            this.material = new THREE.MeshBasicMaterial({
                map: this.texture,
                transparent: true,
                alphaTest: 0.1,
                opacity: opacity,
                side: THREE.DoubleSide,
            });

            this.mesh = new THREE.Mesh(this.geometry, this.material);

            // 设置用户数据，用于交互识别
            this.mesh.userData = {
                componentId: this.__component_id__,
                type: "marker",
                interactive: this.options.interactive,
                markerInstance: this,
            };
        }
    }

    /**
     * 创建默认标记物（使用基础几何体）
     */
    private createDefaultMarker(
        size: number,
        color: number,
        billboard: boolean,
        opacity: number
    ): void {
        if (billboard) {
            const texture = defaultTexture;
            this.spriteMaterial = new THREE.SpriteMaterial({
                map: texture,
                transparent: true,
                alphaTest: 0.1,
                opacity: opacity,
            });

            this.sprite = new THREE.Sprite(this.spriteMaterial);
            this.sprite.scale.set(size, size, 1);

            // 设置用户数据，用于交互识别
            this.sprite.userData = {
                componentId: this.__component_id__,
                type: "marker",
                interactive: this.options.interactive,
                markerInstance: this,
            };
        } else {
            // 创建一个简单的平面几何体作为默认标记
            this.geometry = new THREE.PlaneGeometry(size, size);
            this.material = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: opacity,
                side: THREE.DoubleSide,
            });

            this.mesh = new THREE.Mesh(this.geometry, this.material);

            // 设置用户数据，用于交互识别
            this.mesh.userData = {
                componentId: this.__component_id__,
                type: "marker",
                interactive: this.options.interactive,
                markerInstance: this,
            };
        }
    }

    /**
     * 添加到场景
     */
    private addToScene(): void {
        if (!this.sceneSystem?.scene) {
            console.warn("Scene not available for marker");
            return;
        }

        const object = this.mesh || this.sprite;
        if (object) {
            this.updateTransform();
            this.sceneSystem.scene.add(object);
        }
    }

    /**
     * 从场景移除
     */
    private removeFromScene(): void {
        if (!this.sceneSystem?.scene) {
            return;
        }

        const object = this.mesh || this.sprite;
        if (object) {
            this.sceneSystem.scene.remove(object);
        }
    }

    /**
     * 更新变换矩阵
     */
    private updateTransform(): void {
        const object = this.mesh || this.sprite;
        if (!object) return;

        object.position.copy(this.position);
        if (this.mesh && this.rotation) {
            // Sprite 不需要设置旋转，因为它总是面向相机
            object.rotation.setFromVector3(this.rotation);
        }
        if (this.scale) {
            object.scale.copy(this.scale);
        }
    }

    /**
     * 设置交互事件
     */
    private setupInteraction(): void {
        if (!this.interactive) {
            return;
        }

        // 这里可以设置交互事件监听
        // 实际的事件处理会通过地图的交互系统来处理
        // 当点击或悬停时，交互系统会通过 userData 找到对应的 marker 实例
    }

    /**
     * 处理点击事件
     */
    public handleClick(): void {
        if (this.options.onClick) {
            this.options.onClick(this);
        }
    }

    /**
     * 处理悬停事件
     */
    public handleHover(isHovering: boolean): void {
        if (this.isHovering === isHovering) return;
        if (!this.options || !this.interactive) return;

        this.isHovering = isHovering;

        if (isHovering) {
            this.startHoverAnimation();
        } else {
            this.endHoverAnimation();
        }

        if (this.options.onHover) {
            this.options.onHover(this, isHovering);
        }
    }

    /**
     * 开始悬停动画
     */
    private startHoverAnimation(): void {
        if (this.sprite && this.hoverMaterial) {
            this.sprite.material = this.hoverMaterial;

            this.switchVariant("hover");
        }
    }

    /**
     * 结束悬停动画
     */
    private endHoverAnimation(): void {
        // 先切换回原始纹理
        if (this.texture) {
            this.switchTexture(this.texture);
        }

        if (this.sprite && this.spriteMaterial) {
            this.sprite.material = this.spriteMaterial;

            this.switchVariant("normal");
        }
    }
    private switchVariant(variantName: string): void {
        const variant = this.variants?.get(variantName);

        if (this.sprite) {
            gsap.to(this.scale, {
                x: variant?.size,
                y: variant?.size,
                z: 1,
                duration: 0.15,
                ease: "power2.easeOut",
                onUpdate: () => {
                    this.sprite!.scale.set(
                        this.scale.x,
                        this.scale.y,
                        this.scale.z
                    );
                },
            });
        }
    }
    /**
     * 切换纹理
     */
    private switchTexture(texture: THREE.Texture): void {
        if (this.spriteMaterial) {
            this.spriteMaterial.map = texture;
            this.spriteMaterial.needsUpdate = true;
        } else if (this.material) {
            this.material.map = texture;
            this.material.needsUpdate = true;
        }
    }

    /**
     * 设置颜色
     */
    private setColor(color: THREE.Color): void {
        if (this.material) {
            this.material.color = color;
        }
        if (this.spriteMaterial) {
            this.spriteMaterial.color = color;
        }
    }

    /**
     * 更新标记物大小
     */
    private updateMarkerSize(size: number): void {
        if (this.sprite) {
            this.sprite.scale.set(size, size, 1);
        } else if (this.mesh && this.geometry) {
            // 重新创建几何体以更新大小
            this.geometry.dispose();
            this.geometry = new THREE.PlaneGeometry(size, size);
            this.mesh.geometry = this.geometry;
        }
    }

    /**
     * 清理资源
     */
    protected disposeInternal(): void {
        if (this.geometry) {
            this.geometry.dispose();
        }
        if (this.material) {
            this.material.dispose();
        }
        if (this.spriteMaterial) {
            this.spriteMaterial.dispose();
        }
        if (this.texture) {
            this.texture.dispose();
        }
        if (this.hoverTexture) {
            this.hoverTexture.dispose();
        }

        super.disposeInternal();
    }

    /**
     * 设置位置
     */
    public setPosition(position: THREE.Vector3): void {
        this.position = position;
        this.updateTransform();
    }

    /**
     * 设置旋转
     */
    public setRotation(rotation: THREE.Vector3): void {
        this.rotation = rotation;
        this.updateTransform();
    }

    /**
     * 设置缩放
     */
    public setScale(scale: THREE.Vector3): void {
        this.scale = scale;
        this.updateTransform();
    }

    /**
     * 设置透明度
     */
    public setOpacity(opacity: number): void {
        if (this.material) {
            this.material.opacity = opacity;
        }
        if (this.spriteMaterial) {
            this.spriteMaterial.opacity = opacity;
        }
    }

    /**
     * 获取标记物对象（用于射线检测等）
     */
    public getObject3D(): THREE.Object3D | undefined {
        return this.mesh || this.sprite;
    }

    /**
     * 设置可见性
     */
    public setVisible(visible: boolean): void {
        const object = this.mesh || this.sprite;
        if (object) {
            object.visible = visible;
        }
    }

    /**
     * 获取可见性
     */
    public isVisible(): boolean {
        const object = this.mesh || this.sprite;
        return object ? object.visible : false;
    }

    /**
     * 获取位置
     */
    public getPosition(): THREE.Vector3 {
        return this.position.clone();
    }

    /**
     * 获取世界位置
     */
    public getWorldPosition(): THREE.Vector3 {
        const object = this.mesh || this.sprite;
        if (object) {
            const worldPosition = new THREE.Vector3();
            object.getWorldPosition(worldPosition);
            return worldPosition;
        }
        return this.position.clone();
    }
}
