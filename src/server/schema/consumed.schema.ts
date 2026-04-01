import { z } from "zod";

export const createConsumedSchema = z.object({
    productId: z.coerce.number(),
    whenAdded: z.coerce.date().optional().default(() => new Date()),
    howMany: z.coerce.number().min(0.1).max(999).optional().default(1),
    meal: z.coerce.number().min(0).max(10),
})

export type CreateConsumedSchema = z.infer<typeof createConsumedSchema>

export const consumedSchema = z.object({
    id: z.coerce.number(),
})
    .merge(createConsumedSchema)

export type ConsumedSchema = z.infer<typeof consumedSchema>
