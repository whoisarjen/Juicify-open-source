import { z } from "zod";
import moment from "moment"

export const createMeasurementSchema = z.object({
    whenAdded: z.coerce.date().transform(val => moment(val).toDate()),
    weight: z.coerce.number().min(0).max(999).optional().default(0),
    waist: z.coerce.number().min(0).max(300).optional(),
    hips: z.coerce.number().min(0).max(300).optional(),
})

export type CreateMeasurementSchema = z.infer<typeof createMeasurementSchema>

export const measurementSchema = z.object({
    id: z.number(),
})
    .merge(createMeasurementSchema)

export type MeasurementSchema = z.infer<typeof measurementSchema>
