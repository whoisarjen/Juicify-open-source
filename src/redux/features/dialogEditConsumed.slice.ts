import { createSlice } from "@reduxjs/toolkit";

interface DialogEditConsumed {
    isDialogEditConsumed: boolean
    selectedConsumed: Consumed
}

const initialState: DialogEditConsumed = {
    isDialogEditConsumed: false,
    selectedConsumed: {} as Consumed,
};

export const dialogEditConsumedSlice = createSlice({
    name: "dialogEditConsumed",
    initialState,
    reducers: {
        setSelectedConsumed: (state, action) => {
            state.selectedConsumed = action.payload
        },
        setIsDialogEditConsumed: (state, action) => {
            state.isDialogEditConsumed = action.payload
        },
    },
});

export const {
    setSelectedConsumed,
    setIsDialogEditConsumed,
} = dialogEditConsumedSlice.actions;

export default dialogEditConsumedSlice.reducer;
