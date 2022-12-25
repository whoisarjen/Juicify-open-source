import { ConsumedFieldsFragment } from "@/generated/graphql";
import { createSlice } from "@reduxjs/toolkit";

interface DialogEditConsumed {
    isDialogEditConsumed: boolean
    selectedConsumed: ConsumedFieldsFragment
}

const initialState: DialogEditConsumed = {
    isDialogEditConsumed: false,
    selectedConsumed: {} as ConsumedFieldsFragment,
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
