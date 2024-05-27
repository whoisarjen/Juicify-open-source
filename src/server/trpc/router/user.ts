import { z } from 'zod'

import { router, publicProcedure, protectedProcedure } from "../trpc";
import { userSchema } from "../../schema/user.schema";
import { prepareUserForFE } from "@/utils/user.utils";

export const userRouter = router({
    getByUsername: publicProcedure
        .input(
            z.object({
                username: z.string(),
            })
        )
        .query(async ({ ctx, input: { username } }) => {
            return prepareUserForFE(
                await ctx.prisma.user.findFirstOrThrow({
                    where: {
                        username,
                    }
                })
            )
        }),
    getAll: publicProcedure
        .input(
            z.object({
                take: z.number(),
            })
        )
        .query(async ({ ctx, input: { take } }) => {
            const users = await ctx.prisma.user.findMany({
                take,
                skip: parseInt((Math.random() * 100) as unknown as string),
                orderBy: {
                    id: 'desc',
                },
            })

            return users.map(prepareUserForFE)
        }),
    update: protectedProcedure
        .input(userSchema)
        .mutation(async ({ ctx, input }) => {
            return prepareUserForFE(
                await ctx.prisma.user.update({
                    data: {
                        ...input,
                    },
                    where: {
                        id: ctx.session.user.id,
                    }
                })
            )
        }),
});
