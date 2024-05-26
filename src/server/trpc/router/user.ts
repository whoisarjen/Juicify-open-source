import { z } from 'zod'
import { omit } from 'lodash'

import { router, publicProcedure, protectedProcedure } from "../trpc";
import { userSchema } from "../../schema/user.schema";

export const userRouter = router({
    getByUsername: publicProcedure
        .input(
            z.object({
                username: z.string(),
            })
        )
        .query(async ({ ctx, input: { username } }) => {
            const user = await ctx.prisma.user.findFirstOrThrow({
                where: {
                    username,
                }
            })

            return omit(user, ['email'])
        }),
    getAll: publicProcedure
        .input(
            z.object({
                take: z.number(),
            })
        )
        .query(async ({ ctx, input: { take } }) => {
            return await ctx.prisma.user.findMany({
                take,
                skip: parseInt((Math.random() * 100) as unknown as string),
                orderBy: {
                    id: 'desc',
                },
            })
        }),
    update: protectedProcedure
        .input(userSchema)
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.user.update({
                data: {
                    ...input,
                },
                where: {
                    id: ctx.session.user.id,
                }
            })
        }),
});
