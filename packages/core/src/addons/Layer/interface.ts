import { Mesh } from "three";
import { BaseComponent } from "../BaseComponent";

export interface ITerrain extends BaseComponent {
    name: string;
    mesh: Mesh;
    /**
     * 是否开启交互
     */
    interactive?: boolean;
}
