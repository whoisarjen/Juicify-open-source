import { z } from "zod";

import { exerciseSchema } from "./exercise.schema";

export const workoutPlanSchema = z.object({
    id: z.number(),
    name: z.string().max(100),
    description: z.string().max(500).nullable(),
    burnedCalories: z.number().int().min(0).max(5000),
    exercises: z.array(exerciseSchema),
})

export type WorkoutPlanSchema = z.TypeOf<typeof workoutPlanSchema>
