import { ComponentId } from "@core/interfaces";

let index = 0;

export function createUniqueId(): ComponentId {
    return index++;
}

export function isComponentId(id: any): id is ComponentId {
    return typeof id === "number";
}
