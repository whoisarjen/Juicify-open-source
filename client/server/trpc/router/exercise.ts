import { z } from "zod"

import { router, publicProcedure, protectedProcedure } from "../trpc";

export const exerciseRouter = router({
    getAll: publicProcedure
        .input(
            z.object({
                name: z.string(),
            })
        )
        .query(async ({ ctx, input: { name } }) => {
            return await ctx.prisma.exercise.findMany({
                take: 10,
                where: {
                    OR: [
                        {
                            isDeleted: false,
                            userId: null,
                            name: {
                                contains: name,
                            },
                        },
                        ...(ctx.session?.user?.id
                            ? [{
                                isDeleted: false,
                                userId: ctx.session.user.id,
                                name: {
                                    contains: name,
                                },
                            }]
                            : []
                        )
                    ]
                },
                orderBy: {
                    nameLength: 'asc',
                },
            })
        }),
    create: protectedProcedure
        .input(
            z.object({
                name: z.string(),
            })
        )
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
