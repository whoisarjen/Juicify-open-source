import { articleListSchema, articleGetBySlugSchema } from '@/server/schema/article.schema'
import { resolveArticleLocale, resolveArticleListItem } from '@/server/common/articleLocale'
import { router, publicProcedure } from '../trpc'
import { type Prisma } from '@prisma/client'

export const articleRouter = router({
    list: publicProcedure
        .input(articleListSchema)
        .query(async ({ ctx, input: { page, limit, niche, search, locale } }) => {
            const where: Prisma.ArticleWhereInput = {
                isPublished: true,
            }

            if (niche) {
                where.niche = niche
            }

            if (search) {
                const suffix = locale.charAt(0).toUpperCase() + locale.slice(1)
                const titleField = `title${suffix}`
                const excerptField = `excerpt${suffix}`

                where.OR = [
                    { [titleField]: { contains: search, mode: 'insensitive' } },
                    { [excerptField]: { contains: search, mode: 'insensitive' } },
                    { titleEn: { contains: search, mode: 'insensitive' } },
                    { excerptEn: { contains: search, mode: 'insensitive' } },
                ]
            }

            const [articles, total] = await Promise.all([
                ctx.prisma.article.findMany({
                    where,
                    orderBy: { publishedAt: 'desc' },
                    skip: (page - 1) * limit,
                    take: limit,
                }),
                ctx.prisma.article.count({ where }),
            ])

            return {
                articles: articles.map((a) => resolveArticleListItem(a, locale)),
                total,
                page,
                totalPages: Math.ceil(total / limit),
            }
        }),

    getBySlug: publicProcedure
        .input(articleGetBySlugSchema)
        .query(async ({ ctx, input: { slug, locale } }) => {
            const article = await ctx.prisma.article.findFirstOrThrow({
                where: { slug, isPublished: true },
            })

            const resolved = resolveArticleLocale(article, locale)

            const relatedArticles = await ctx.prisma.article.findMany({
                where: {
                    isPublished: true,
                    slug: { not: slug },
                    ...(article.niche ? { niche: article.niche } : {}),
                },
                orderBy: { publishedAt: 'desc' },
                take: 3,
            })

            let related = relatedArticles
            if (related.length < 2) {
                const more = await ctx.prisma.article.findMany({
                    where: {
                        isPublished: true,
                        slug: { notIn: [slug, ...related.map((r) => r.slug)] },
                    },
                    orderBy: { publishedAt: 'desc' },
                    take: 3 - related.length,
                })
                related = [...related, ...more]
            }

            return {
                ...resolved,
                relatedArticles: related.map((a) => resolveArticleListItem(a, locale)),
            }
        }),

    sitemap: publicProcedure
        .query(async ({ ctx }) => {
            return await ctx.prisma.article.findMany({
                where: { isPublished: true },
                select: { slug: true, updatedAt: true },
                orderBy: { publishedAt: 'desc' },
            })
        }),
})
