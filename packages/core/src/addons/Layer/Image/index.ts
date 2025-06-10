import * as THREE from "three";
import { BaseComponent } from "../../BaseComponent";
import { IImageLayerOptions } from "./type";
import { toDefaulted } from "es-toolkit/compat";
import { IBounds } from "@core/interfaces";
import { Bounds } from "@core/entity/Bounds";

export class ImageLayer extends BaseComponent {
    geometry?: THREE.PlaneGeometry;
    material?: THREE.Material;
    loader?: THREE.TextureLoader;
    texture?: THREE.Texture;
    displacement?: THREE.Texture;
    displacementScale?: number;
    aoMap?: THREE.Texture;
    aoMapIntensity?: number;
    mask?: THREE.Texture;
    bounds: IBounds;
    #options: IImageLayerOptions;
    constructor(options: Partial<IImageLayerOptions>) {
        super();

        const finalOptions = toDefaulted(options, {
            src: "",
            widthSegments: 256,
            heightSegments: 256,
            displacementScale: 700,
            displacementSrc: "",
            aoIntensity: 1,
            aoSrc: "",
            elevation: 0,
            maskSrc: "",
            bounds: [0, 0, 0, 0, 0, 0],
        });

        this.bounds = new Bounds(finalOptions.bounds);

        this.#options = finalOptions;

        this.displacementScale = finalOptions.displacementScale;
        this.aoMapIntensity =
            this.#options.aoIntensity ?? -this.#options.aoIntensity;

        console.log("TerrainComponent", this.options);
    }
    get options() {
        return this.#options;
    }
    onAdd(): void {
        if (!this.context) {
            throw new Error("TerrainComponent must be added to a Map");
        }
        const bounds = this.context.bounds;
        this.bounds = this.bounds ?? bounds;

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
        const { widthSegments, heightSegments } = this.options;
        const bounds = this.bounds;

        this.geometry = new THREE.PlaneGeometry(
            bounds.rangeX,
            bounds.rangeY,
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
