import { z } from "zod"

export const exerciseSchema = z.object({
    id: z.number(),
    name: z.string(),
})

export type ExerciseSchema = z.infer<typeof exerciseSchema>

export const createExerciseSchema = z.object({
    name: z.string(),
})

export type CreateExerciseSchema = z.infer<typeof createExerciseSchema>
