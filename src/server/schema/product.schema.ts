import { z } from "zod";
import { decimal } from "./decimal";

export const createProductSchema = z.object({
    name: z.string().min(3).max(255),
    proteins: decimal(z.coerce.number().min(0).max(999)).optional().default(0),
    carbs: decimal(z.coerce.number().min(0).max(999)).optional().default(0),
    sugar: decimal(z.coerce.number().min(0).max(999)).optional().default(0),
    fats: decimal(z.coerce.number().min(0).max(999)).optional().default(0),
    fiber: decimal(z.coerce.number().min(0).max(999)).optional().default(0),
    sodium: decimal(z.coerce.number().min(0).max(999)).optional().default(0),
    ethanol: decimal(z.coerce.number().min(0).max(999)).optional().default(0),
    barcode: z.string().max(10000).optional(),
    isExpectingCheck: z.boolean().default(false),
})

export type CreateProductSchema = z.infer<typeof createProductSchema>

export const productSchema = z.object({
    id: z.coerce.number(),
})
    .merge(createProductSchema)

export type ProductSchema = z.infer<typeof productSchema>
