import { createSlice } from "@reduxjs/toolkit";

interface DialogShowProduct {
    isDialogShowProduct: boolean
    selectedProduct: Product
}

const initialState: DialogShowProduct = {
    isDialogShowProduct: false,
    selectedProduct: {} as Product,
};

export const dialogShowProductSlice = createSlice({
    name: "dialogShowProduct",
    initialState,
    reducers: {
        setSelectedProduct: (state, action) => {
            state.selectedProduct = action.payload
        },
        setIsDialogShowProduct: (state, action) => {
            state.isDialogShowProduct = action.payload
        },
    },
});

export const {
    setSelectedProduct,
    setIsDialogShowProduct,
} = dialogShowProductSlice.actions;

export default dialogShowProductSlice.reducer;
