import { Mesh } from "three";
import { BaseComponent } from "../BaseComponent";
import { Point } from "@core/entity/Point";
import { Coord } from "@core/entity";

export interface ITerrain extends BaseComponent {
    name: string;
    mesh: Mesh;
    /**
     * 是否开启交互
     */
    interactive?: boolean;

    pointToCoord(position: Point): Coord;
}
