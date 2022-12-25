import { ExerciseFieldsFragment } from "@/generated/graphql";
import { createSlice } from "@reduxjs/toolkit";

interface DialogAddExercises {
    checked: ExerciseFieldsFragment[]
}

const initialState: DialogAddExercises = {
    checked: [],
};

export const dialogAddExercisesSlice = createSlice({
    name: "dialogAddExercises",
    initialState,
    reducers: {
        addToChecked: (state, action) => {
            state.checked = [...state.checked, action.payload]
        },
        removeFromChecked: (state, action) => {
            state.checked = state.checked.filter(x => x.id !== action.payload.id)
        },
        cleanChecked: (state) => {
            state.checked = []
        },
    },
});

export const {
    addToChecked,
    removeFromChecked,
    cleanChecked,
} = dialogAddExercisesSlice.actions;

export default dialogAddExercisesSlice.reducer;
