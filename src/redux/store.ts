import { configureStore } from "@reduxjs/toolkit";
import dialogAddProduct from './features/dialogAddProduct.slice'
import dialogAddProducts from './features/dialogAddProducts.slice'
import dialogAddExercises from './features/dialogAddExercises.slice'
import dialogEditConsumed from './features/dialogEditConsumed.slice'
import dialogShowProduct from './features/dialogShowProduct.slice'

export const store = configureStore({
    reducer: {
        dialogAddProduct,
        dialogAddProducts,
        dialogAddExercises,
        dialogEditConsumed,
        dialogShowProduct,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
