import { z } from "zod";

import { exerciseSchema } from "./exercise.schema";

export const workoutPlanExerciseSchema = exerciseSchema
    .pick({ id: true, name: true })

export type WorkoutPlanExerciseSchema = z.infer<typeof workoutPlanExerciseSchema>

export const createWorkoutPlanSchema = z.object({
    name: z.string().min(3).max(100),
})

export type CreateWorkoutPlanSchema = z.infer<typeof createWorkoutPlanSchema>

export const workoutPlanSchema = z.object({
    id: z.number(),
    description: z.string().max(500).nullable(),
    burnedCalories: z.preprocess(val => Number(val), z.number().min(0).max(9999)).optional().default(0),
    exercises: z.array(workoutPlanExerciseSchema)
        .optional()
        .default([])
}).merge(createWorkoutPlanSchema)

export type WorkoutPlanSchema = z.infer<typeof workoutPlanSchema>
