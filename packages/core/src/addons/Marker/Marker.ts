import { BaseComponent } from "../BaseComponent";
import { IMarkerOptions } from "./interface";
import * as THREE from "three";
import { toDefaulted, uniqueId } from "es-toolkit/compat";

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

/**
 * TODO
 * 固定大小，不随地图缩放
 * 排除光照影响
 * 指针交互事件
 * popup 弹窗
 */
export class Marker extends BaseComponent<IMarkerOptions> {
    private mesh?: THREE.Mesh;
    private geometry?: THREE.PlaneGeometry;
    private material?: THREE.MeshBasicMaterial;
    private texture?: THREE.Texture;
    private loader?: THREE.TextureLoader;
    private sprite?: THREE.Sprite;
    private spriteMaterial?: THREE.SpriteMaterial;

    private position: THREE.Vector3;
    private rotation: THREE.Vector3;
    private scale: THREE.Vector3;
    constructor(options: Partial<IMarkerOptions>) {
        // 创建一个完整的选项对象，确保所有必需的属性都有值
        const completeOptions: IMarkerOptions = toDefaulted(options, {
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
            size: 1,
            color: 0xffffff,
            interactive: true,
            opacity: 1,
            billboard: true,
            iconUrl: "",
            name: uniqueId("marker_"),
            onHover: () => {},
            onClick: () => {},
        });
        super(completeOptions);

        this.position = new THREE.Vector3(...completeOptions.position);
        this.rotation = new THREE.Vector3(...completeOptions.rotation!);
        this.scale = new THREE.Vector3(...completeOptions.scale!);
    }

    onAdd(): void {
        this.createMarker();
        this.addToScene();
        this.setupInteraction();
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
     * 创建标记物
     */
    private createMarker(): void {
        const { iconUrl, size, color, billboard, opacity } = this.options;

        if (iconUrl) {
            // 使用图片纹理创建标记
            this.createTexturedMarker(iconUrl, size!, billboard!, opacity!);
        } else {
            // 使用默认几何体创建标记
            this.createDefaultMarker(size!, color!, billboard!, opacity!);
        }
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
        this.loader = new THREE.TextureLoader();
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
                interactive: this.options.interactive,
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
        if (!this.options.interactive) {
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
        if (this.options.onHover) {
            this.options.onHover(this, isHovering);
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
    private dispose(): void {
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
        this.options.opacity = opacity;
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
