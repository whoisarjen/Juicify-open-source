import { createSlice } from "@reduxjs/toolkit";

interface DialogAddProducts {
    isDialogAddProducts: boolean
    mealToAdd: number
    checked: (Product & { howMany: number })[]
}

const initialState: DialogAddProducts = {
    isDialogAddProducts: false,
    mealToAdd: 0,
    checked: [],
};

export const dialogAddProductsSlice = createSlice({
    name: "dialogAddProducts",
    initialState,
    reducers: {
        addToChecked: (state, action) => {
            state.checked = [...state.checked, action.payload]
        },
        changeChecked: (state, action) => {
            state.checked = state.checked.map(x => x.id === action.payload.id ? action.payload : x)
        },
        removeFromChecked: (state, action) => {
            state.checked = state.checked.filter(x => x.id !== action.payload.id)
        },
        cleanChecked: (state) => {
            state.checked = []
        },
        setMealToAdd: (state, action) => {
            state.mealToAdd = action.payload
        },
        setIsDialogAddProducts: (state, action) => {
            state.isDialogAddProducts = action.payload
        },
    },
});

export const {
    addToChecked,
    changeChecked,
    removeFromChecked,
    cleanChecked,
    setMealToAdd,
    setIsDialogAddProducts,
} = dialogAddProductsSlice.actions;

export default dialogAddProductsSlice.reducer;
