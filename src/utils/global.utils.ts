export const getIsRunningStandalone = () => {
    return (window.matchMedia('(display-mode: standalone)').matches);
}

export const updateArray = <T>(array: (T & { id: number })[] = [], newObject: { id: number }) =>
    array.map(object => {
        if (object.id === newObject.id) {
            return {
                ...object,
                ...newObject,
            }
        }

        return object
    }) as unknown as T[]

export const reloadSession = () => {
    const event = new Event("visibilitychange");
    document.dispatchEvent(event);
}
