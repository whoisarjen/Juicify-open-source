import { object, preprocess, boolean, number, TypeOf, string, array, date } from "zod"

export const resultSchema = object({
    open: preprocess((val) => Boolean(val), boolean()).optional(),
    reps: preprocess((val) => Number(val), number()),
    weight: preprocess((val) => Number(val), number()),
})

export type ResultSchema = TypeOf<typeof resultSchema>

export const workoutResultExerciseSchema = object({
    id: number().optional(),
    name: string().optional(),
    results: array(resultSchema).optional().default([]),
})

export type WorkoutResultExerciseSchema = TypeOf<typeof workoutResultExerciseSchema>

export const workoutResultSchema = object({
    id: number(),
    name: string(),
    whenAdded: date(),
    note: string().optional().nullable(),
    burnedCalories: preprocess((val) => Number(val), number().min(0).max(5000)),
    exercises: array(workoutResultExerciseSchema).optional().default([]),
})

export type WorkoutResultSchema = TypeOf<typeof workoutResultSchema>