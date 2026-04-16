import { z } from "zod";

import { exerciseSchema } from "./exercise.schema";
import { decimal } from "./decimal";

export const workoutPlanExerciseSchema = z.object({
    series: z.coerce.number().min(1).max(10).optional().nullable(),
    reps: z.coerce.number().min(1).max(100).optional().nullable(),
    rir: z.coerce.number().min(0).max(5).optional().nullable(),
    note: z.string().max(255).optional().nullable(),
}).merge(exerciseSchema.pick({ id: true, name: true }))

export type WorkoutPlanExerciseSchema = z.infer<typeof workoutPlanExerciseSchema>

export const createWorkoutPlanSchema = z.object({
    name: z.string().min(3).max(100),
})

export type CreateWorkoutPlanSchema = z.infer<typeof createWorkoutPlanSchema>

export const workoutPlanSchema = z.object({
    id: z.coerce.number(),
    description: z.string().max(500).nullable(),
    burnedCalories: decimal(z.coerce.number().min(0).max(9999)).optional().default(0),
    exercises: z.array(workoutPlanExerciseSchema)
        .optional()
        .default([])
}).merge(createWorkoutPlanSchema)

export type WorkoutPlanSchema = z.infer<typeof workoutPlanSchema>
