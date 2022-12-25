export const getIsRunningStandalone = () => {
    return (window.matchMedia('(display-mode: standalone)').matches);
}