import { z } from "zod";
import moment from "moment"
import { decimal } from "./decimal";

export const createMeasurementSchema = z.object({
    whenAdded: z.coerce.date().transform(val => moment(val).toDate()),
    weight: decimal(z.coerce.number().min(0).max(999)).optional().default(0),
    waist: decimal(z.coerce.number().min(0).max(300)).optional(),
    hips: decimal(z.coerce.number().min(0).max(300)).optional(),
    pulseSleep: z.coerce.number().int().min(1).max(5).optional(),
    pulseFatigue: z.coerce.number().int().min(1).max(5).optional(),
    pulseMood: z.coerce.number().int().min(1).max(5).optional(),
    pulseSoreness: z.coerce.number().int().min(1).max(5).optional(),
    pulseStress: z.coerce.number().int().min(1).max(5).optional(),
    pulseErection: z.coerce.number().int().min(1).max(5).optional(),
})

export type CreateMeasurementSchema = z.infer<typeof createMeasurementSchema>

export const measurementSchema = z.object({
    id: z.coerce.number(),
})
    .merge(createMeasurementSchema)

export type MeasurementSchema = z.infer<typeof measurementSchema>
