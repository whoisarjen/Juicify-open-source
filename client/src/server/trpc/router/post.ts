import { z } from 'zod'

import { router, publicProcedure } from "../trpc";

export const postRouter = router({
    getById: publicProcedure
        .input(
            z.object({
                id: z.number(),
            })
        )
        .query(async ({ ctx, input: { id } }) => {
            return await ctx.prisma.post.findFirstOrThrow({
                where: {
                    id,
                }
            })
        }),
    getAll: publicProcedure
        .input(
            z.object({
                take: z.number(),
            })
        )
        .query(async ({ ctx, input: { take } }) => {
            return await ctx.prisma.post.findMany({
                take,
                orderBy: {
                    id: 'desc',
                },
            })
        }),
});
