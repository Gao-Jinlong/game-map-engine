import { Map as MapInstance } from "../Map";
export class SystemManager {
    allSystems: Map<MapEngine.SystemClass, MapEngine.ISystem>;
    constructor(private context: MapEngine.IMap) {
        this.allSystems = new Map();
    }

    register<S extends MapEngine.ISystem>(
        Class: MapEngine.SystemClass<MapInstance, S>
    ) {
        const system = new Class();
        system.context = this.context;
        this.allSystems.set(Class, system);
    }

    getSystem<S extends MapEngine.ISystem>(
        Class: MapEngine.SystemClass<MapInstance, S>
    ): S {
        return this.allSystems.get(Class) as S;
    }

    init() {
        this.allSystems.forEach((system) => {
            system.init?.();
        });
    }
    resize(state: MapEngine.IMapState) {
        this.allSystems.forEach((system) => {
            system.resize?.(state);
        });
    }
}
