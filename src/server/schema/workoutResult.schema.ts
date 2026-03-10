import { object, preprocess, boolean, number, TypeOf, string, array, date } from "zod"

import { workoutPlanExerciseSchema } from './workoutPlan.schema'

export const workoutResultExerciseResultSchema = object({
    open: preprocess((val) => Boolean(val), boolean()).optional(),
    reps: preprocess((val) => Number(val), number()),
    weight: preprocess((val) => Number(val), number()),
    rir: preprocess((val) => Number(val), number()).optional(), // RIR wasn't supported before 20.07.2023
    setAt: string().optional(), // UTC ISO timestamp when set was opened/recorded
    timezone: string().optional(), // IANA timezone e.g. "Europe/Warsaw" - stored for future tz-aware display
})

export type WorkoutResultExerciseResultSchema = TypeOf<typeof workoutResultExerciseResultSchema>

export const workoutResultExerciseSchema = object({
    results: array(workoutResultExerciseResultSchema).optional().default([]),
})
    .merge(workoutPlanExerciseSchema)

export type WorkoutResultExerciseSchema = TypeOf<typeof workoutResultExerciseSchema>

export const workoutResultSchema = object({
    id: number(),
    name: string(),
    whenAdded: date(),
    finishedAt: date().optional().nullable(),
    note: string().optional().nullable(),
    burnedCalories: preprocess((val) => Number(val), number().min(0).max(5000)),
    exercises: array(workoutResultExerciseSchema).optional().default([]),
})

export type WorkoutResultSchema = TypeOf<typeof workoutResultSchema>