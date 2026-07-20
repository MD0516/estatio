export const removeUndefined = <T extends Record<string, any>>(
    obj: T
): { [K in keyof T]?: Exclude<T[K], undefined> } => {
    return Object.fromEntries(
        Object.entries(obj).filter(([, value]) => value !== undefined)
    ) as { [K in keyof T]?: Exclude<T[K], undefined> };
};