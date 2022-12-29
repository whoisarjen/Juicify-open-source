import { z } from "zod";

export const createExerciseSchema = z.object({
    name: z.string().min(3).max(100),
})

export type CreateExerciseSchema = z.infer<typeof createExerciseSchema>

export const exerciseSchema = z.object({
    id: z.number(),
    userId: z.number().optional(),
})
    .merge(createExerciseSchema)

export type ExerciseSchema = z.infer<typeof exerciseSchema>
