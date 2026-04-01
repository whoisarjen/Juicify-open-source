import { z } from "zod"

import { workoutPlanExerciseSchema } from './workoutPlan.schema'

export const workoutResultExerciseResultSchema = z.object({
    open: z.coerce.boolean().optional(),
    reps: z.coerce.number(),
    weight: z.coerce.number(),
    rir: z.coerce.number().optional(), // RIR wasn't supported before 20.07.2023
    setAt: z.string().optional(), // UTC ISO timestamp when set was opened/recorded
    timezone: z.string().optional(), // IANA timezone e.g. "Europe/Warsaw" - stored for future tz-aware display
})

export type WorkoutResultExerciseResultSchema = z.infer<typeof workoutResultExerciseResultSchema>

export const workoutResultExerciseSchema = z.object({
    results: z.array(workoutResultExerciseResultSchema).optional().default([]),
})
    .merge(workoutPlanExerciseSchema)

export type WorkoutResultExerciseSchema = z.infer<typeof workoutResultExerciseSchema>

export const workoutResultSchema = z.object({
    id: z.coerce.number(),
    name: z.string(),
    whenAdded: z.coerce.date(),
    finishedAt: z.coerce.date().optional().nullable(),
    note: z.string().optional().nullable(),
    burnedCalories: z.coerce.number().min(0).max(5000),
    exercises: z.array(workoutResultExerciseSchema).optional().default([]),
})

export type WorkoutResultSchema = z.infer<typeof workoutResultSchema>
