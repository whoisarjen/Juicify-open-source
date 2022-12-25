import { ProductFieldsFragment } from "@/generated/graphql";
import { createSlice } from "@reduxjs/toolkit";

interface DialogAddProduct {
    isDialogAddProduct: boolean
    mealToAdd: number
    selectedProduct: ProductFieldsFragment
}

const initialState: DialogAddProduct = {
    isDialogAddProduct: false,
    mealToAdd: 0,
    selectedProduct: {} as ProductFieldsFragment,
};

export const dialogAddProductSlice = createSlice({
    name: "dialogAddProduct",
    initialState,
    reducers: {
        setSelectProduct: (state, action) => {
            state.selectedProduct = action.payload
        },
        setMealToAdd: (state, action) => {
            state.mealToAdd = action.payload
        },
        setIsDialogAddProduct: (state, action) => {
            state.isDialogAddProduct = action.payload
        },
    },
});

export const {
    setSelectProduct,
    setMealToAdd,
    setIsDialogAddProduct,
} = dialogAddProductSlice.actions;

export default dialogAddProductSlice.reducer;
