export interface IComponent {
  init(): void;
  update(): void;
  render(): void;
  destroy(): void;
}
