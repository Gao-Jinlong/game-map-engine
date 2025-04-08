import { Vector3 } from "three";

export interface ICamera {
  pitch: number;
  roll: number;
  zoom: number;
  position: Vector3;

  flyTo(position: Vector3): void;
  rollTo(roll: number): void;
  zoomTo(zoom: number): void;
  update(): void;
  render(): void;
}
