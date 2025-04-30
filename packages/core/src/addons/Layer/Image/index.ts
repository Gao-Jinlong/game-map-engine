import * as THREE from "three";
import { BaseComponent } from "../../BaseComponent";
import { IImageLayerOptions } from "./type";
import { toDefaulted } from "es-toolkit/compat";

export class ImageLayer extends BaseComponent<IImageLayerOptions> {
    geometry?: THREE.PlaneGeometry;
    material?: THREE.Material;
    loader?: THREE.TextureLoader;
    texture?: THREE.Texture;
    displacement?: THREE.Texture;
    displacementScale?: number;
    aoMap?: THREE.Texture;
    aoMapIntensity?: number;
    mask?: THREE.Texture;
    constructor(options: Partial<IImageLayerOptions>) {
        const finalOptions = toDefaulted(options, {
            src: "",
            width: 7500,
            height: 7500,
            widthSegments: 256,
            heightSegments: 256,
            displacementScale: 700,
            displacementSrc: "",
            aoIntensity: 1,
            aoSrc: "",
            elevation: 0,
            maskSrc: "",
        });
        super(finalOptions);

        this.displacementScale = finalOptions.displacementScale;
        this.aoMapIntensity =
            this.options.aoIntensity ?? -this.options.aoIntensity;

        console.log("TerrainComponent", this.options);
    }
    onAdd(): void {
        if (!this.context) {
            throw new Error("TerrainComponent must be added to a Map");
        }

        const world = this.context.options.world;
        if (world) {
            this.options.width = world.width;
            this.options.height = world.height;
        }

        this.loadTexture();
        this.createPlane();
    }
    onUpdate(): void {}
    onRemove(): void {}
    onResize(): void {}

    loadTexture(): void {
        const { src } = this.options;
        this.loader = new THREE.TextureLoader();
        this.texture = this.loader.load(src);
        this.texture.wrapS = THREE.ClampToEdgeWrapping;
        this.texture.wrapT = THREE.ClampToEdgeWrapping;
        this.texture.colorSpace = THREE.SRGBColorSpace;

        if (this.options.displacementSrc) {
            const displacement = new THREE.TextureLoader().load(
                this.options.displacementSrc
            );
            displacement.wrapS = THREE.ClampToEdgeWrapping;
            displacement.wrapT = THREE.ClampToEdgeWrapping;
            displacement.colorSpace = THREE.SRGBColorSpace;
            this.displacement = displacement;
        }

        if (this.options.aoSrc) {
            this.aoMap = new THREE.TextureLoader().load(this.options.aoSrc);
            this.aoMap.colorSpace = THREE.SRGBColorSpace;
            this.aoMap.wrapS = THREE.ClampToEdgeWrapping;
            this.aoMap.wrapT = THREE.ClampToEdgeWrapping;
        }

        if (this.options.maskSrc) {
            this.mask = new THREE.TextureLoader().load(this.options.maskSrc);
            this.mask.colorSpace = THREE.SRGBColorSpace;
            this.mask.wrapS = THREE.ClampToEdgeWrapping;
            this.mask.wrapT = THREE.ClampToEdgeWrapping;
        }
    }
    createPlane(): void {
        const { width, height, widthSegments, heightSegments } = this.options;

        this.geometry = new THREE.PlaneGeometry(
            width,
            height,
            widthSegments - 1,
            heightSegments - 1
        );
        this.geometry.rotateX(-Math.PI / 2);

        this.material = new THREE.MeshStandardMaterial({
            map: this.texture,
            displacementMap: this.displacement,
            displacementScale: this.displacementScale,
            aoMap: this.aoMap,
            aoMapIntensity: this.aoMapIntensity,
            alphaMap: this.mask,
            transparent: true,
        });

        const mesh = new THREE.Mesh(this.geometry, this.material);

        mesh.position.y = this.options.elevation;

        this.sceneSystem?.scene?.add(mesh);
    }
}
