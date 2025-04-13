let index = 0;

export function createUniqueId(): string {
    return `${index++}`;
}
