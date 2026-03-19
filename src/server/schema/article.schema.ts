import { z } from 'zod'

export const articleListSchema = z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(50).default(10),
    niche: z.string().optional(),
    search: z.string().optional(),
    locale: z.string().min(2).max(2).default('en'),
})

export const articleGetBySlugSchema = z.object({
    slug: z.string(),
    locale: z.string().min(2).max(2).default('en'),
})
