import z from 'zod'
import _ from 'lodash'

import { router, publicProcedure } from "../trpc";
import { getFromStrapi } from '@/utils/strapi.utils';

export const postRouter = router({
    getAll: publicProcedure
        .input(
            z.object({
                take: z.number(),
            })
        )
        .query(async ({ input: { take } }) => {
            const posts = await getFromStrapi('posts')
            const random = _.random(0, posts.data.length - take)

            return {
                ...posts,
                data: posts.data.slice(random, random + take)
            }
        }),
});
