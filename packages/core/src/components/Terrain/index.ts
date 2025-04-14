import * as THREE from "three";
import { BaseComponent } from "../BaseComponent";
import { ITerrainOptions } from "./type";
import { toDefaulted } from "es-toolkit/compat";
import { ImprovedNoise } from "three/examples/jsm/math/ImprovedNoise";

export class TerrainComponent extends BaseComponent<ITerrainOptions> {
    geometry?: THREE.PlaneGeometry;
    material?: THREE.MeshBasicMaterial;
    constructor(options: Partial<ITerrainOptions>) {
        const finalOptions = toDefaulted(options, {
            color: 0x000000,
            depth: 100,
            width: 7500,
            height: 7500,
            widthSegments: 256,
            heightSegments: 256,
        });

        super(finalOptions);

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
            this.options.depth = world.depth;
        }

        this.createTerrain();
    }
    onUpdate(): void {}
    onRemove(): void {}
    onResize(): void {}

    createTerrain(): void {
        const { width, height, depth, widthSegments, heightSegments } =
            this.options;

        const data = generateHeight(width, depth);

        // TODO fix 渲染破面
        this.geometry = new THREE.PlaneGeometry(
            width,
            height,
            widthSegments,
            heightSegments
        );
        this.geometry.rotateX(-Math.PI / 2);

        const vertices = this.geometry.attributes.position.array;
        for (let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
            vertices[j + 1] = data[i] * 10;
        }

        const texture = new THREE.CanvasTexture(
            generateTexture(data, width, depth)
        );
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.colorSpace = THREE.SRGBColorSpace;

        const mesh = new THREE.Mesh(
            this.geometry,
            new THREE.MeshBasicMaterial({ map: texture })
        );

        this.sceneSystem?.scene?.add(mesh);
    }
}
function generateHeight(width: number, height: number) {
    const size = width * height,
        data = new Uint8Array(size),
        perlin = new ImprovedNoise(),
        z = Math.random() * 100;

    let quality = 1;

    for (let j = 0; j < 4; j++) {
        for (let i = 0; i < size; i++) {
            const x = i % width,
                y = ~~(i / width);
            data[i] += Math.abs(
                perlin.noise(x / quality, y / quality, z) * quality * 1.75
            );
        }

        quality *= 5;
    }

    return data;
}

function generateTexture(data: Uint8Array, width: number, height: number) {
    // bake lighting into texture

    let context: CanvasRenderingContext2D | null,
        image: ImageData | null,
        imageData: Uint8ClampedArray | null,
        shade: number;

    const vector3 = new THREE.Vector3(0, 0, 0);

    const sun = new THREE.Vector3(1, 1, 1);
    sun.normalize();

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    context = canvas.getContext("2d");
    if (!context) {
        throw new Error("Failed to create canvas context");
    }
    context.fillStyle = "#000";
    context.fillRect(0, 0, width, height);

    image = context.getImageData(0, 0, canvas.width, canvas.height);
    imageData = image.data;

    for (let i = 0, j = 0, l = imageData.length; i < l; i += 4, j++) {
        vector3.x = data[j - 2] - data[j + 2];
        vector3.y = 2;
        vector3.z = data[j - width * 2] - data[j + width * 2];
        vector3.normalize();

        shade = vector3.dot(sun);

        imageData[i] = (96 + shade * 128) * (0.5 + data[j] * 0.007);
        imageData[i + 1] = (32 + shade * 96) * (0.5 + data[j] * 0.007);
        imageData[i + 2] = shade * 96 * (0.5 + data[j] * 0.007);
    }

    context.putImageData(image, 0, 0);

    // Scaled 4x

    const canvasScaled = document.createElement("canvas");
    canvasScaled.width = width * 4;
    canvasScaled.height = height * 4;

    context = canvasScaled.getContext("2d");
    if (!context) {
        throw new Error("Failed to create canvas context");
    }
    context.scale(4, 4);
    context.drawImage(canvas, 0, 0);

    image = context.getImageData(0, 0, canvasScaled.width, canvasScaled.height);
    imageData = image.data;

    for (let i = 0, l = imageData.length; i < l; i += 4) {
        const v = ~~(Math.random() * 5);

        imageData[i] += v;
        imageData[i + 1] += v;
        imageData[i + 2] += v;
    }

    context.putImageData(image, 0, 0);

    return canvasScaled;
}
