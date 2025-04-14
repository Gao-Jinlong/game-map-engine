import * as THREE from "three";
import { BaseComponent } from "@core/components/BaseComponent";

export class Axis extends BaseComponent {
    private axesHelper?: THREE.AxesHelper;
    private gridHelper?: THREE.GridHelper;

    constructor() {
        super();
    }

    onAdd() {
        // 创建坐标轴
        this.axesHelper = new THREE.AxesHelper(1000);
        this.axesHelper.position.set(0, 0, 0);

        // 创建网格
        this.gridHelper = new THREE.GridHelper(1000, 20, 0x888888, 0x888888);
        this.gridHelper.position.set(0, 0, 0);

        // 添加到场景
        this.scene.add(this.axesHelper);
        this.scene.add(this.gridHelper);
    }

    update() {
        // 可以在这里添加更新逻辑
    }

    onRemove() {
        if (this.axesHelper) {
            this.scene.remove(this.axesHelper);
        }
        if (this.gridHelper) {
            this.scene.remove(this.gridHelper);
        }
    }
}
