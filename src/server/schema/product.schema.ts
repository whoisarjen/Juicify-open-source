import { z } from "zod";

export const createProductSchema = z.object({
    name: z.string().min(3).max(255),
    proteins: z.preprocess(val => Number(val), z.number().min(0).max(999)).optional().default(0),
    carbs: z.preprocess(val => Number(val), z.number().min(0).max(999)).optional().default(0),
    sugar: z.preprocess(val => Number(val), z.number().min(0).max(999)).optional().default(0),
    fats: z.preprocess(val => Number(val), z.number().min(0).max(999)).optional().default(0),
    fiber: z.preprocess(val => Number(val), z.number().min(0).max(999)).optional().default(0),
    sodium: z.preprocess(val => Number(val), z.number().min(0).max(999)).optional().default(0),
    ethanol: z.preprocess(val => Number(val), z.number().min(0).max(999)).optional().default(0),
    barcode: z.string().max(10000).optional(),
    isExpectingCheck: z.boolean().default(false),
})

export type CreateProductSchema = z.infer<typeof createProductSchema>

export const productSchema = z.object({
    id: z.number(),
})
    .merge(createProductSchema)

export type ProductSchema = z.infer<typeof productSchema>