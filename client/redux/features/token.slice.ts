import { createSlice } from "@reduxjs/toolkit";

export interface Token {
    id: string
    username: string
    numberOfMeals: number
    proteinsDay0: number
    carbsDay0: number
    fatsDay0: number
    proteinsDay1: number
    carbsDay1: number
    fatsDay1: number
    proteinsDay2: number
    carbsDay2: number
    fatsDay2: number
    proteinsDay3: number
    carbsDay3: number
    fatsDay3: number
    proteinsDay4: number
    carbsDay4: number
    fatsDay4: number
    proteinsDay5: number
    carbsDay5: number
    fatsDay5: number
    proteinsDay6: number
    carbsDay6: number
    fatsDay6: number
    nextCoach: Date
    goal: number
    isCoachAnalyze: boolean
    height: number
    birth: Date
    exp: number
    origIat: number
}

const initialState: Partial<Token> = {};

export const tokenSlice = createSlice({
    name: "token",
    initialState,
    reducers: {
        updateToken: (state) => Object.assign(state, JSON.parse(localStorage.getItem('payload') || '{}')),
        removeToken: () => Object.assign({}, initialState),
    },
});

export const { removeToken, updateToken } = tokenSlice.actions;

export default tokenSlice.reducer;
