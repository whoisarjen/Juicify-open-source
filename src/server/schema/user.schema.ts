import moment from "moment";
import { z } from "zod";

export const userSchema = z.object({
    proteinsDay0: z.number().min(0).max(9999).default(0).optional(),
    carbsDay0: z.number().min(0).max(9999).default(0).optional(),
    fatsDay0: z.number().min(0).max(9999).default(0).optional(),
    proteinsDay1: z.number().min(0).max(9999).default(0).optional(),
    carbsDay1: z.number().min(0).max(9999).default(0).optional(),
    fatsDay1: z.number().min(0).max(9999).default(0).optional(),
    proteinsDay2: z.number().min(0).max(9999).default(0).optional(),
    carbsDay2: z.number().min(0).max(9999).default(0).optional(),
    fatsDay2: z.number().min(0).max(9999).default(0).optional(),
    proteinsDay3: z.number().min(0).max(9999).default(0).optional(),
    carbsDay3: z.number().min(0).max(9999).default(0).optional(),
    fatsDay3: z.number().min(0).max(9999).default(0).optional(),
    proteinsDay4: z.number().min(0).max(9999).default(0).optional(),
    carbsDay4: z.number().min(0).max(9999).default(0).optional(),
    fatsDay4: z.number().min(0).max(9999).default(0).optional(),
    proteinsDay5: z.number().min(0).max(9999).default(0).optional(),
    carbsDay5: z.number().min(0).max(9999).default(0).optional(),
    fatsDay5: z.number().min(0).max(9999).default(0).optional(),
    proteinsDay6: z.number().min(0).max(9999).default(0).optional(),
    carbsDay6: z.number().min(0).max(9999).default(0).optional(),
    fatsDay6: z.number().min(0).max(9999).default(0).optional(),
    numberOfMeals: z.preprocess((val) => Number(val), z.number().min(1).max(10)).optional(),
    fiber: z.preprocess((val) => Number(val), z.number().min(0).max(100)).optional(),
    carbsPercentAsSugar: z.preprocess((val) => Number(val), z.number().min(0).max(100)).optional(),
    birth: z.preprocess(birth => moment(String(birth)).toDate(), z.date()).optional(),
    height: z.preprocess((val) => Number(val), z.number().min(120).max(250)).optional(),
    description: z.string().max(255).optional(),
    website: z.string().max(150).optional(),
    facebook: z.string().max(150).optional(),
    instagram: z.string().max(150).optional(),
    twitter: z.string().max(150).optional(),
})

export type UserSchema = z.infer<typeof userSchema>
