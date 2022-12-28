import { z } from "zod";

export const workoutPlanExerciseSchema = z.object({
    id: z.number(),
    name: z.string(),
})

export type WorkoutPlanExerciseSchema = z.infer<typeof workoutPlanExerciseSchema>

export const workoutPlanSchema = z.object({
    id: z.number(),
    name: z.string().max(100),
    description: z.string().max(500).nullable(),
    burnedCalories: z.number().int().min(0).max(5000),
    exercises: z.array(workoutPlanExerciseSchema),
})

export type WorkoutPlanSchema = z.TypeOf<typeof workoutPlanSchema>
