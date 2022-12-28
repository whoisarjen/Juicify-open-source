import { z } from "zod";

export const createExerciseSchema = z.object({
    name: z.string(),
})

export type CreateExerciseSchema = z.infer<typeof createExerciseSchema>
