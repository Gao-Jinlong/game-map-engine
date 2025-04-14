import { ComponentId } from "@core/interfaces/IComponentManager";

let index = 0;

export function createUniqueId(): ComponentId {
    return index++;
}

export function isComponentId(id: any): id is ComponentId {
    return typeof id === "number";
}
