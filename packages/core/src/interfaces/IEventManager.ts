export interface IEventManager {
  on(event: string, callback: Function): void;
  off(event: string, callback: Function): void;
  emit(event: string, data: any): void;
}
