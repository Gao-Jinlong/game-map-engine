import * as THREE from "three";
import { BaseComponent } from "@core/addons/BaseComponent";
import { IBaseComponentOptions } from "@core/interfaces";

export class Axis extends BaseComponent {
    #options: IBaseComponentOptions;

    private axesHelper?: THREE.AxesHelper;
    private gridHelper?: THREE.GridHelper;

    constructor(options: Partial<IBaseComponentOptions>) {
        super();
        this.#options = options;
    }
    get options(): IBaseComponentOptions {
        return this.#options;
    }

    onAdd() {
        // 创建坐标轴
        this.axesHelper = new THREE.AxesHelper(1000);
        this.axesHelper.position.set(0, 0, 0);

        // 创建网格
        this.gridHelper = new THREE.GridHelper(1000, 20, 0x888888, 0x888888);
        this.gridHelper.position.set(0, 0, 0);

        // 添加到场景
        this.sceneSystem?.scene?.add(this.axesHelper);
        this.sceneSystem?.scene?.add(this.gridHelper);
    }

    update() {
        // 可以在这里添加更新逻辑
    }
    onUpdate?(): void {
        throw new Error("Method not implemented.");
    }
    onResize?(): void {
        throw new Error("Method not implemented.");
    }
    onRemove() {
        if (this.axesHelper) {
            this.sceneSystem?.scene?.remove(this.axesHelper);
        }
        if (this.gridHelper) {
            this.sceneSystem?.scene?.remove(this.gridHelper);
        }
    }
}
