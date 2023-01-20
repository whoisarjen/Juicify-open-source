import { createExerciseSchema } from "@/server/schema/exercise.schema";
import { z } from "zod"

import { router, publicProcedure, protectedProcedure } from "../trpc";

export const exerciseRouter = router({
    getAll: publicProcedure // TODO need to more natural language for name
        .input(
            z.object({
                name: z.string(),
            })
        )
        .query(async ({ ctx, input: { name } }) => {
            const contains = name.trim()

            return await ctx.prisma.exercise.findMany({
                take: 10,
                where: {
                    OR: [
                        {
                            isDeleted: false,
                            userId: null,
                            name: {
                                contains,
                                mode: 'insensitive',
                            },
                        },
                        {
                            isDeleted: false,
                            userId: ctx.session?.user?.id || null,
                            name: {
                                contains,
                                mode: 'insensitive',
                            },
                        },
                    ]
                },
                orderBy: {
                    nameLength: 'asc',
                },
            })
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
