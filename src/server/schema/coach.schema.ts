import { goals, activityLevels, kindOfDiets } from "@prisma/client";
import { z } from "zod";
import { measurementSchema } from "./measurement.schema";

export const coachSchema = z.object({
    goal: z.nativeEnum(goals),
    kindOfDiet: z.nativeEnum(kindOfDiets),
    isSportActive: z.boolean(),
    activityLevel: z.nativeEnum(activityLevels),
})

export type CoachSchema = z.infer<typeof coachSchema>

export const createCoachSchema = z.object({
    data: measurementSchema,
})
    .merge(coachSchema)

export type CreateCoachSchema = z.infer<typeof createCoachSchema>
