import moment from "moment";
import { z } from "zod";

export const createBurnedCaloriesSchema = z.object({
    name: z.string().max(255),
    whenAdded: z.preprocess(whenAdded => moment(String(whenAdded)).toDate(), z.date()),
    burnedCalories: z.preprocess((val) => Number(val), z.number().min(0).max(9999)),
})

export type CreateBurnedCaloriesSchema = z.infer<typeof createBurnedCaloriesSchema>

export const burnedCaloriesSchema = z.object({
    id: z.number(),
})
    .merge(createBurnedCaloriesSchema)

export type BurnedCaloriesSchema = z.infer<typeof burnedCaloriesSchema>
