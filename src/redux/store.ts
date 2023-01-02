import { configureStore } from "@reduxjs/toolkit";
import dialogAddProduct from './features/dialogAddProduct.slice'

export const store = configureStore({
    reducer: {
        dialogAddProduct,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
