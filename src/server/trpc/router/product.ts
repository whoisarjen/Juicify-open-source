import { createProductSchema } from "@/server/schema/product.schema";
import { Prisma } from "@prisma/client";
import { z } from "zod"

import { router, publicProcedure, protectedProcedure } from "../trpc";

const removeDiacritics = (str: string) =>
    str
        .replace(/ł/g, 'l')
        .replace(/Ł/g, 'L')
        .normalize('NFD')
        // eslint-disable-next-line no-control-regex
        .replace(/[\u0300-\u036f]/g, '')

const buildTsQuery = (input: string): string | null => {
    const terms = removeDiacritics(input.trim().toLowerCase())
        .split(/\s+/)
        .map((t) => t.replace(/\W/g, ''))
        .filter((t) => t.length > 0)

    if (terms.length === 0) return null

    return terms
        .map((t) => (t.length > 3 ? `${t.slice(0, -1)}:*` : `${t}:*`))
        .join(' & ')
}

export const productRouter = router({
    getById: publicProcedure
        .input(
            z.object({
                id: z.coerce.number(),
            })
        )
        .query(async ({ ctx, input: { id } }) => {
            return await ctx.prisma.product.findFirstOrThrow({
                where: {
                    OR: [
                        {
                            isDeleted: false,
                            userId: null,
                            id,
                        },
                        {
                            isDeleted: false,
                            userId: ctx.session?.user?.id || null,
                            id,
                        },
                    ]
                },
            })
        }),
    getByBarcode: publicProcedure
        .input(
            z.object({
                barcode: z.string(),
            })
        )
        .query(async ({ ctx, input: { barcode } }) => {
            return await ctx.prisma.product.findFirstOrThrow({
                where: {
                    OR: [
                        {
                            isDeleted: false,
                            userId: null,
                            barcode,
                        },
                        {
                            isDeleted: false,
                            userId: ctx.session?.user?.id || null,
                            barcode,
                        },
                    ]
                },
                orderBy: {
                    userId: 'asc',
                },
            })
        }),
    getAll: publicProcedure
        .input(
            z.object({
                name: z.string(),
                take: z.coerce.number().optional().default(10),
                skip: z.coerce.number().optional().default(0),
            })
        )
        .query(async ({ ctx, input: { name, take, skip } }) => {
            const trimmed = name.trim()

            if (!trimmed) {
                return await ctx.prisma.product.findMany({
                    take,
                    skip,
                    where: {
                        OR: [
                            { isDeleted: false, userId: null },
                            { isDeleted: false, userId: ctx.session?.user?.id || null },
                        ],
                    },
                    orderBy: { nameLength: 'asc' },
                })
            }

            const tsQuery = buildTsQuery(trimmed)
            if (!tsQuery) return []

            const normalizedName = removeDiacritics(trimmed).toLowerCase()
            const userId = ctx.session?.user?.id ?? null

            return await ctx.prisma.$queryRaw<Prisma.ProductGetPayload<{}>[]>`
                SELECT *
                FROM "Product"
                WHERE
                    "isDeleted" IS NOT TRUE
                    AND ("userId" IS NULL OR "userId" = ${userId})
                    AND to_tsvector('simple', coalesce("nameNormalized", ''))
                        @@ to_tsquery('simple', ${tsQuery})
                ORDER BY
                    CASE
                        WHEN lower("nameNormalized") = ${normalizedName} THEN 0
                        WHEN lower("nameNormalized") LIKE ${normalizedName + '%'} THEN 1
                        ELSE 2
                    END ASC,
                    "nameLength" ASC
                LIMIT ${take}
                OFFSET ${skip}
            `
        }),
    create: protectedProcedure
        .input(createProductSchema)
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.product.create({
                data: {
                    ...input,
                    nameLength: input.name.length,
                    nameNormalized: removeDiacritics(input.name).toLowerCase(),
                    userId: ctx.session.user.id,
                }
            })
        }),
    delete: protectedProcedure
        .input(
            z.object({
                id: z.coerce.number(),
            })
        )
        .mutation(async ({ ctx, input: { id } }) => {
            return await ctx.prisma.product.update({
                data: {
                    isDeleted: true,
                },
                where: {
                    id_userId: {
                        id,
                        userId: ctx.session.user.id,
                    }
                }
            })
        }),
})
