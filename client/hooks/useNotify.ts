import { createContext, useContext } from "react";

export const NotifyContext = createContext({
    error: (text: string = 'Error') => { },
    success: (text: string = 'Success') => { }
});

export const useNotify = () => {
    const notify = useContext(NotifyContext);

    return {
        error: (text?: string) => notify.error(text),
        success: (text?: string) => notify.success(text),
        errorNotify: (text?: string) => notify.error(text),
    }
}