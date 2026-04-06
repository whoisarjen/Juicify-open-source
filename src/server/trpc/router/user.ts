import { z } from 'zod'

import { router, protectedProcedure } from "../trpc";
import { userSchema } from "../../schema/user.schema";
import { prepareUserForFE } from "@/utils/user.utils";

export const userRouter = router({
    getByUsername: protectedProcedure
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
