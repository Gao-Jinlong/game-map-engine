import { BaseComponent } from "@core/components/BaseComponent";
import { Mesh } from "three";

export interface ITerrain extends BaseComponent {
    name: string;
    mesh: Mesh;
    /**
     * 是否开启交互
     */
    interactive?: boolean;
}
