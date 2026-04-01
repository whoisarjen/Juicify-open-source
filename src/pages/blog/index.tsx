import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { type GetServerSideProps } from 'next'
import useTranslation from 'next-translate/useTranslation'
import Typography from '@mui/material/Typography'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import moment from 'moment'
import { trpc } from '@/utils/trpc.utils'
import { prisma } from '@/server/db/client'
import { resolveArticleListItem } from '@/server/common/articleLocale'

const ARTICLES_PER_PAGE = 10

type ArticleListItem = {
    slug: string
    title: string
    excerpt: string
    featuredImageUrl: string | null
    featuredImageAlt: string | null
    readingTimeMinutes: number
    publishedAt: string
    niche: string | null
}

type BlogPageProps = {
    initialArticles: ArticleListItem[]
    initialTotalPages: number
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const locale = context.locale || 'en'

    const [articles, total] = await Promise.all([
        prisma.article.findMany({
            where: { isPublished: true },
            orderBy: { publishedAt: 'desc' },
            take: ARTICLES_PER_PAGE,
        }),
        prisma.article.count({ where: { isPublished: true } }),
    ])

    return {
        props: {
            initialArticles: JSON.parse(
                JSON.stringify(
                    articles.map((a) => resolveArticleListItem(a, locale))
                )
            ),
            initialTotalPages: Math.ceil(total / ARTICLES_PER_PAGE),
        },
    }
}

const BlogPage = ({ initialArticles, initialTotalPages }: BlogPageProps) => {
    const { t } = useTranslation('blog')
    const router = useRouter()
    const locale = router.locale || 'en'
    const [page, setPage] = useState(1)

    const { data, isLoading } = trpc.article.list.useQuery(
        {
            page,
            limit: ARTICLES_PER_PAGE,
            locale,
        },
        {
            enabled: page > 1,
        }
    )

    const articles = page === 1 ? initialArticles : (data?.articles ?? [])
    const totalPages =
        page === 1 ? initialTotalPages : (data?.totalPages ?? initialTotalPages)
    const isPageLoading = page > 1 && isLoading
    const featuredArticle = articles[0]
    const gridArticles = articles.slice(1)

    return (
        <div className="flex w-full flex-col">
            <Head>
                <title>
                    Juicify Blog — Nutrition, Fitness & Wellness Articles
                </title>
                <meta
                    name="description"
                    content="Expert articles on nutrition science, diet guides, exercise science, and wellness. Free evidence-based content from Juicify."
                />
                <meta
                    property="og:title"
                    content="Juicify Blog — Nutrition, Fitness & Wellness Articles"
                />
                <meta
                    property="og:description"
                    content="Expert articles on nutrition science, diet guides, exercise science, and wellness."
                />
                <meta property="og:type" content="website" />
                <meta
                    property="og:url"
                    content="https://juicify.app/blog"
                />
                <meta
                    property="og:image"
                    content="https://juicify.app/images/logo.png"
                />
            </Head>

            {/* Page Header */}
            <div className="mb-8 pt-6">
                <Typography
                    variant="h4"
                    component="h1"
                    className="!font-bold"
                >
                    {t('LATEST_NEWS')}
                </Typography>
                <div className="mt-2 h-1 w-12 rounded-full bg-[#90caf9]/40" />
            </div>

            {/* Loading State */}
            {isPageLoading && (
                <div className="flex flex-col gap-6">
                    {/* Featured skeleton */}
                    <div className="overflow-hidden rounded-xl bg-white dark:bg-gray-800">
                        <div className="h-[320px] animate-pulse bg-gray-200 dark:bg-gray-700" />
                        <div className="p-4">
                            <div className="mb-2 h-7 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                            <div className="mb-2 h-9 w-[70%] animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                            <div className="mb-1 h-5 w-[90%] animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                            <div className="h-5 w-[60%] animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                        </div>
                    </div>

                    {/* Grid skeletons */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="overflow-hidden rounded-xl bg-white dark:bg-gray-800">
                                <div className="h-[180px] animate-pulse bg-gray-200 dark:bg-gray-700" />
                                <div className="p-4">
                                    <div className="mb-2 h-6 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                                    <div className="mb-2 h-7 w-[80%] animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                                    <div className="mb-1 h-[18px] w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                                    <div className="h-[18px] w-[40%] animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!isPageLoading && articles.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20">
                    <Typography
                        variant="h6"
                        className="!text-gray-400 dark:!text-gray-500"
                    >
                        {t('NO_ARTICLES')}
                    </Typography>
                </div>
            )}

            {/* Content */}
            {!isPageLoading && articles.length > 0 && (
                <div className="flex flex-col gap-6">
                    {/* Featured Article (Hero) */}
                    {featuredArticle && page === 1 && (
                        <Link
                            href={`/blog/${featuredArticle.slug}`}
                            className="group block"
                        >
                            <div className="overflow-hidden rounded-xl bg-white shadow transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] dark:bg-gray-800">
                                {featuredArticle.featuredImageUrl && (
                                    <img
                                        src={featuredArticle.featuredImageUrl}
                                        alt={
                                            featuredArticle.featuredImageAlt ||
                                            featuredArticle.title
                                        }
                                        className="h-[220px] w-full object-cover md:h-[320px]"
                                    />
                                )}
                                <div className="p-2.5 md:p-3">
                                    <div className="mb-2 flex flex-wrap items-center gap-2">
                                        {featuredArticle.niche && (
                                            <span className="rounded-full bg-[#90caf9]/10 px-2.5 py-0.5 text-xs font-semibold text-[#90caf9]">
                                                {t(`NICHE_${featuredArticle.niche}`)}
                                            </span>
                                        )}
                                    </div>
                                    <h2 className="mb-2 line-clamp-2 text-xl font-bold">
                                        {featuredArticle.title}
                                    </h2>
                                    <p className="mb-4 text-sm text-gray-400 line-clamp-2">
                                        {featuredArticle.excerpt}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        {featuredArticle.readingTimeMinutes && (
                                            <span className="flex items-center gap-1">
                                                <AccessTimeIcon
                                                    sx={{ fontSize: 14 }}
                                                />
                                                {t('MINUTES_READ', {
                                                    count: featuredArticle.readingTimeMinutes,
                                                })}
                                            </span>
                                        )}
                                        {featuredArticle.publishedAt && (
                                            <span className="flex items-center gap-1">
                                                <CalendarTodayIcon
                                                    sx={{ fontSize: 14 }}
                                                />
                                                {moment(
                                                    featuredArticle.publishedAt
                                                ).format('MMM D, YYYY')}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )}

                    {/* Articles Grid */}
                    {(page === 1 ? gridArticles : articles).length > 0 && (
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {(page === 1 ? gridArticles : articles).map(
                                (article) => (
                                    <Link
                                        key={article.slug}
                                        href={`/blog/${article.slug}`}
                                        className="group block"
                                    >
                                        <div className="flex h-full flex-col overflow-hidden rounded-xl bg-white shadow transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] dark:bg-gray-800">
                                            {article.featuredImageUrl && (
                                                <img
                                                    src={article.featuredImageUrl}
                                                    alt={
                                                        article.featuredImageAlt ||
                                                        article.title
                                                    }
                                                    className="h-[180px] w-full object-cover"
                                                />
                                            )}
                                            <div className="flex flex-1 flex-col p-2.5">
                                                <div className="mb-2 flex flex-wrap items-center gap-2">
                                                    {article.niche && (
                                                        <span className="rounded-full bg-[#90caf9]/10 px-2.5 py-0.5 text-[0.7rem] font-semibold text-[#90caf9]">
                                                            {t(`NICHE_${article.niche}`)}
                                                        </span>
                                                    )}
                                                </div>
                                                <h2 className="mb-1 line-clamp-2 text-base font-bold leading-[1.3]">
                                                    {article.title}
                                                </h2>
                                                <p className="mb-auto pb-3 text-sm text-gray-400 line-clamp-2">
                                                    {article.excerpt}
                                                </p>
                                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                                    {article.readingTimeMinutes && (
                                                        <span className="flex items-center gap-1">
                                                            <AccessTimeIcon
                                                                sx={{
                                                                    fontSize: 14,
                                                                }}
                                                            />
                                                            {t(
                                                                'MINUTES_READ',
                                                                {
                                                                    count: article.readingTimeMinutes,
                                                                }
                                                            )}
                                                        </span>
                                                    )}
                                                    {article.publishedAt && (
                                                        <span className="flex items-center gap-1">
                                                            <CalendarTodayIcon
                                                                sx={{
                                                                    fontSize: 14,
                                                                }}
                                                            />
                                                            {moment(
                                                                article.publishedAt
                                                            ).format(
                                                                'MMM D, YYYY'
                                                            )}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            )}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 pb-8 pt-4">
                            <button
                                onClick={() => setPage(page - 1)}
                                disabled={page === 1}
                                className="rounded-lg px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
                            >
                                &lsaquo;
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`min-w-[40px] rounded-lg px-3 py-2 text-sm transition-colors ${
                                        p === page
                                            ? 'bg-blue-500 text-white'
                                            : 'text-gray-400 hover:bg-white/10'
                                    }`}
                                >
                                    {p}
                                </button>
                            ))}
                            <button
                                onClick={() => setPage(page + 1)}
                                disabled={page === totalPages}
                                className="rounded-lg px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
                            >
                                &rsaquo;
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default BlogPage
