import { z } from "zod"

export const ingredientSchema = z.object({
    name: z.string().min(1).max(255),
    amount: z.coerce.number().min(0).max(99999),
    unit: z.string().min(1).max(20),
})

export type IngredientSchema = z.infer<typeof ingredientSchema>

export const createSupplementSchema = z.object({
    name: z.string().min(1).max(255),
    ingredients: z.array(ingredientSchema).min(1),
    timeOfDay: z.string().max(20).default("morning"),
    frequency: z.coerce.number().min(1).max(365).default(1),
    isActive: z.boolean().default(true),
})

export type CreateSupplementSchema = z.infer<typeof createSupplementSchema>

export const supplementSchema = z.object({
    id: z.coerce.number(),
}).merge(createSupplementSchema)

export type SupplementSchema = z.infer<typeof supplementSchema>
