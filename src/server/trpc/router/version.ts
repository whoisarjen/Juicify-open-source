import { router, publicProcedure } from "../trpc";

export const versionRouter = router({
    get: publicProcedure
        .query(() => {
            return '' // TODO Get Vercel Deploy Id
        }),
});
