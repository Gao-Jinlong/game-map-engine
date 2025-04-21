import { ISystem } from "./ISystem";

export interface ICrsSystem extends ISystem {
    project(lng: number, lat: number): { x: number; y: number };
    unproject(x: number, y: number): { lng: number; lat: number };
}
