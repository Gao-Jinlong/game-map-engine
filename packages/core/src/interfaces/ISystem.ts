import { IMap, IMapState } from "./IMap";

export interface ISystem<S extends IMap = IMap> {
    context?: S;
    /** Method called when the system is initialized. Called only once when the system is instantiated. */
    init?: () => void;
    // /** Method called when the system is awakened. Called every time the game is started. */
    // awake?: () => void;
    // /** Method called when the system's game logic starts. Called every time the game is started. */
    // start?: () => void;
    // /** Method called every time the game updates, with the delta time passed as argument. Called multiple times during gameplay. */
    // update?: (delta: number) => void;
    // /** Method called when the system's game logic needs to end. Called every time the game has ended. */
    // end?: () => void;
    // /** Method called to reset the system. Called every time the game has ended. */
    // reset?: () => void;
    /** Method called when the system is resized, with the new width and height passed as arguments. Called every time the screen has resized. */
    resize?: (state: IMapState) => void;
    /** Method called when the system is destroyed. Called only once when the system is destroyed. */
    destroy?: () => void;
}

export interface SystemClass<
    _MAP extends IMap = IMap,
    SYSTEM extends ISystem<IMap> = ISystem<IMap>
> {
    new (): SYSTEM;
}
