import { router, protectedProcedure } from "../trpc";
import { userSchema } from "../../schema/user.schema";

export const userRouter = router({
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
