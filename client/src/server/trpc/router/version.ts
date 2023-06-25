import { router, publicProcedure } from "../trpc";
import fs from 'fs'
import path from 'path'

export const versionRouter = router({
    get: publicProcedure
        .query(() => {
            const dir = path.resolve('./public', '')
            const filenames = fs.readdirSync(dir)

            return filenames.find(filename => filename.includes('fallback')) || ''
        }),
});
