import { z } from "zod";
import moment from "moment"

export const createMeasurementSchema = z.object({
    whenAdded: z.preprocess(whenAdded => moment(String(whenAdded)).toDate(), z.date()),
    weight: z.preprocess(val => Number(val), z.number().min(0).max(999)).optional().default(0),
    waist: z.preprocess(val => val === '' || val === null || val === undefined ? undefined : Number(val), z.number().min(0).max(300).optional()),
    hips: z.preprocess(val => val === '' || val === null || val === undefined ? undefined : Number(val), z.number().min(0).max(300).optional()),
})

export type CreateMeasurementSchema = z.infer<typeof createMeasurementSchema>

export const measurementSchema = z.object({
    id: z.number(),
})
    .merge(createMeasurementSchema)

export type MeasurementSchema = z.infer<typeof measurementSchema>
