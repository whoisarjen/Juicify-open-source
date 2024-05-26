import { z } from "zod";

export const createConsumedSchema = z.object({
    productId: z.number(),
    whenAdded: z.date().optional().default(new Date()),
    howMany: z.preprocess(val => Number(val), z.number().min(0.1).max(999)).optional().default(1),
    meal: z.number().min(0).max(10),
})

export type CreateConsumedSchema = z.infer<typeof createConsumedSchema>

export const consumedSchema = z.object({
    id: z.number(),
})
    .merge(createConsumedSchema)

export type ConsumedSchema = z.infer<typeof consumedSchema>
