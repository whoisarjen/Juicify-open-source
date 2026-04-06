import { createExerciseSchema } from "@/server/schema/exercise.schema";
import { z } from "zod"

import { router, protectedProcedure } from "../trpc";

const removeDiacritics = (str: string) =>
    str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

export const exerciseRouter = router({
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
            // await ctx.prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_exercise_name_trgm ON "Exercise" USING gin (name gin_trgm_ops)`);
            // await ctx.prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_exercise_name_tsv ON "Exercise" USING gin (to_tsvector('simple', name))`);

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
                    SELECT e.*, 2 AS match_priority
                    FROM "Exercise" e
                    WHERE e."isDeleted" = false
                      AND (e."userId" IS NULL OR e."userId" = ${userId})
                      AND UPPER(e.name) = ${normalizedName}
                ),
                fulltext_matches AS (
                    SELECT e.*, 1 AS match_priority
                    FROM "Exercise" e
                    WHERE e."isDeleted" = false
                      AND (e."userId" IS NULL OR e."userId" = ${userId})
                      AND e.id NOT IN (SELECT id FROM exact_matches)
                      AND to_tsvector('simple', e.name) @@ to_tsquery('simple', ${tsQuery})
                ),
                all_matches AS (
                    SELECT * FROM exact_matches
                    UNION ALL SELECT * FROM fulltext_matches
                )
                SELECT id, "createdAt", "updatedAt", "userId", name, "nameLength", "isDeleted"
                FROM all_matches
                ORDER BY match_priority DESC, "nameLength" ASC
                LIMIT ${take} OFFSET ${skip}
            `
        }),
    create: protectedProcedure
        .input(createExerciseSchema)
        .mutation(async ({ ctx, input: { name } }) => {
            return await ctx.prisma.exercise.create({
                data: {
                    name,
                    nameLength: name.length,
                    userId: ctx.session.user.id,
                }
            })
        })
});
