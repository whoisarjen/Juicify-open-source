import { configureStore } from "@reduxjs/toolkit";
import dialogAddProduct from './features/dialogAddProduct.slice'
import dialogShowProduct from './features/dialogShowProduct.slice'
import dialogEditConsumed from './features/dialogEditConsumed.slice'

export const store = configureStore({
    reducer: {
        dialogAddProduct,
        dialogShowProduct,
        dialogEditConsumed,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
