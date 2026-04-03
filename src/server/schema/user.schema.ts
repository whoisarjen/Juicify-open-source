import { z } from "zod";
import { decimal } from "./decimal";

export const userSchema = z.object({
    proteinsDay0: decimal(z.coerce.number().min(0).max(9999)).default(0).optional(),
    carbsDay0: decimal(z.coerce.number().min(0).max(9999)).default(0).optional(),
    fatsDay0: decimal(z.coerce.number().min(0).max(9999)).default(0).optional(),
    proteinsDay1: decimal(z.coerce.number().min(0).max(9999)).default(0).optional(),
    carbsDay1: decimal(z.coerce.number().min(0).max(9999)).default(0).optional(),
    fatsDay1: decimal(z.coerce.number().min(0).max(9999)).default(0).optional(),
    proteinsDay2: decimal(z.coerce.number().min(0).max(9999)).default(0).optional(),
    carbsDay2: decimal(z.coerce.number().min(0).max(9999)).default(0).optional(),
    fatsDay2: decimal(z.coerce.number().min(0).max(9999)).default(0).optional(),
    proteinsDay3: decimal(z.coerce.number().min(0).max(9999)).default(0).optional(),
    carbsDay3: decimal(z.coerce.number().min(0).max(9999)).default(0).optional(),
    fatsDay3: decimal(z.coerce.number().min(0).max(9999)).default(0).optional(),
    proteinsDay4: decimal(z.coerce.number().min(0).max(9999)).default(0).optional(),
    carbsDay4: decimal(z.coerce.number().min(0).max(9999)).default(0).optional(),
    fatsDay4: decimal(z.coerce.number().min(0).max(9999)).default(0).optional(),
    proteinsDay5: decimal(z.coerce.number().min(0).max(9999)).default(0).optional(),
    carbsDay5: decimal(z.coerce.number().min(0).max(9999)).default(0).optional(),
    fatsDay5: decimal(z.coerce.number().min(0).max(9999)).default(0).optional(),
    proteinsDay6: decimal(z.coerce.number().min(0).max(9999)).default(0).optional(),
    carbsDay6: decimal(z.coerce.number().min(0).max(9999)).default(0).optional(),
    fatsDay6: decimal(z.coerce.number().min(0).max(9999)).default(0).optional(),
    numberOfMeals: decimal(z.coerce.number().min(1).max(10)).optional(),
    fiber: decimal(z.coerce.number().min(0).max(100)).optional(),
    carbsPercentAsSugar: decimal(z.coerce.number().min(0).max(100)).optional(),
    birth: z.coerce.date().optional(),
    height: decimal(z.coerce.number().min(0).max(250)).optional(),
    description: z.string().max(255).optional(),
    website: z.string().max(150).optional(),
    facebook: z.string().max(150).optional(),
    instagram: z.string().max(150).optional(),
    twitter: z.string().max(150).optional(),
    searchAllPlans: z.boolean().optional(),
})

export type UserSchema = z.infer<typeof userSchema>
