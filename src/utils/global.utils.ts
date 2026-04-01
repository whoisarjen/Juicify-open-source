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

/**
 * Converts a local date string (YYYY-MM-DD) to UTC start/end boundaries
 * for the user's local day. This ensures server queries match the user's
 * timezone regardless of the server's timezone.
 */
export const getLocalDayBounds = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00')
    const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0)
    const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999)
    return {
        startDate: start.toISOString(),
        endDate: end.toISOString(),
    }
}
