import { z } from "zod";

export const createBurnedCaloriesSchema = z.object({
    name: z.string().max(255),
    whenAdded: z.coerce.date(),
    burnedCalories: z.coerce.number().min(0).max(9999),
})

export type CreateBurnedCaloriesSchema = z.infer<typeof createBurnedCaloriesSchema>

export const burnedCaloriesSchema = z.object({
    id: z.coerce.number(),
})
    .merge(createBurnedCaloriesSchema)

export type BurnedCaloriesSchema = z.infer<typeof burnedCaloriesSchema>
