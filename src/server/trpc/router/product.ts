import { createProductSchema } from "@/server/schema/product.schema";
import { z } from "zod"

import { router, protectedProcedure } from "../trpc";

const removeDiacritics = (str: string) =>
    str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

export const productRouter = router({
    getById: protectedProcedure
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
                            userId: ctx.session.user.id,
                            id,
                        },
                    ]
                },
            })
        }),
    getByBarcode: protectedProcedure
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
                            userId: ctx.session.user.id,
                            barcode,
                        },
                    ]
                },
                orderBy: {
                    userId: 'asc',
                },
            })
        }),
    getAll: protectedProcedure
        .input(
            z.object({
                name: z.string(),
                take: z.coerce.number().optional().default(10),
                skip: z.coerce.number().optional().default(0),
            })
        )
        .query(async ({ ctx, input: { name, take, skip } }) => {
            // === SEARCH MIGRATION — uncomment, trigger one search, then comment back ===
            // await ctx.prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS pg_trgm`);
            // await ctx.prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_product_name_trgm ON "Product" USING gin (name gin_trgm_ops)`);
            // await ctx.prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_product_name_tsv ON "Product" USING gin (to_tsvector('simple', name))`);
            // await ctx.prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_product_barcode ON "Product" (barcode) WHERE barcode IS NOT NULL`);

            const rawName = name.trim()
            const normalizedName = removeDiacritics(rawName).toUpperCase()
            const terms = normalizedName.split(/\s+/).filter(Boolean)

            if (terms.length === 0) {
                return []
            }

            const tsQuery = terms
                .map(term => term.replace(/\W/g, ''))
                .filter(term => term.length > 0)
                .map(term => term.length > 3 ? `${term.slice(0, -1)}:*` : `${term}:*`)
                .join(' & ')

            const userId = ctx.session.user.id

            return await ctx.prisma.$queryRaw<any[]>`
                WITH exact_matches AS (
                    SELECT p.*, 2 AS match_priority
                    FROM "Product" p
                    WHERE p."isDeleted" = false
                      AND (p."userId" IS NULL OR p."userId" = ${userId})
                      AND (p.barcode = ${rawName} OR UPPER(p.name) = ${normalizedName})
                ),
                fulltext_matches AS (
                    SELECT p.*, 1 AS match_priority
                    FROM "Product" p
                    WHERE p."isDeleted" = false
                      AND (p."userId" IS NULL OR p."userId" = ${userId})
                      AND p.id NOT IN (SELECT id FROM exact_matches)
                      AND to_tsvector('simple', p.name) @@ to_tsquery('simple', ${tsQuery})
                ),
                all_matches AS (
                    SELECT * FROM exact_matches
                    UNION ALL SELECT * FROM fulltext_matches
                )
                SELECT id, "createdAt", "updatedAt", "userId", name, "nameLength",
                       proteins, carbs, sugar, fats, fiber, sodium, ethanol,
                       "gramsPerPortion", barcode, "isVerified", "isDeleted", "isExpectingCheck"
                FROM all_matches
                ORDER BY match_priority DESC, "nameLength" ASC
                LIMIT ${take} OFFSET ${skip}
            `
        }),
    create: protectedProcedure
        .input(createProductSchema)
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.product.create({
                data: {
                    ...input,
                    nameLength: input.name.length,
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
