import { z } from "zod";

export const createMeasurementSchema = z.object({
    whenAdded: z.date(),
    weight: z.preprocess(val => Number(val), z.number().min(0).max(999)).optional().default(0),
})

export type CreateMeasurementSchema = z.infer<typeof createMeasurementSchema>

export const measurementSchema = z.object({
    id: z.number(),
})
    .merge(createMeasurementSchema)

export type MeasurementSchema = z.infer<typeof measurementSchema>
