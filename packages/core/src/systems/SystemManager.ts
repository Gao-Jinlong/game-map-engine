import { IMap, IMapState, ISystem, SystemClass } from "@core/interfaces";
import { Map as MapInstance } from "../Map";
import Disposable from "@core/components/Disposable";
export class SystemManager extends Disposable {
    allSystems: Map<SystemClass, ISystem>;
    constructor(private context: IMap) {
        super();
        this.allSystems = new Map();
    }

    register<S extends ISystem>(Class: SystemClass<MapInstance, S>) {
        const system = new Class();
        system.context = this.context;
        this.allSystems.set(Class, system);
    }

    getSystem<S extends ISystem>(Class: SystemClass<MapInstance, S>): S {
        return this.allSystems.get(Class) as S;
    }

    init() {
        this.allSystems.forEach((system) => {
            system.init?.();
        });
    }
    resize(state: IMapState) {
        this.allSystems.forEach((system) => {
            system.resize?.(state);
        });
    }
    protected disposeInternal(): void {
        this.allSystems.forEach((system) => {
            system.destroy?.();
        });
    }
}
