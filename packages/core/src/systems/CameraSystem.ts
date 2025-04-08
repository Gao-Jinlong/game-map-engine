import { Vector3 } from "three";
import { ICamera } from "../interfaces/ICamera";
import { IMap } from "../interfaces/IMap";

export class CameraSystem implements ICamera {
  pitch: number = 0;
  roll: number = 0;
  zoom: number = 0;
  position: Vector3 = new Vector3();
  constructor(private context: IMap) {}
  flyTo(position: Vector3): void {
    this.position.copy(position);
  }
  rollTo(roll: number): void {
    this.roll = roll;
  }
  zoomTo(zoom: number): void {
    this.zoom = zoom;
  }
  update(): void {
    throw new Error("Method not implemented.");
  }
  render(): void {
    throw new Error("Method not implemented.");
  }
}
