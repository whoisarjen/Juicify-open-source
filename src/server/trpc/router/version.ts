import { router, publicProcedure } from "../trpc";
import { env } from "@/env/server.mjs";

export const versionRouter = router({
    get: publicProcedure
        .query(() => {
            return env.VERCEL_DEPLOYMENT_ID
        }),
});
