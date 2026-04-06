import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { type GetServerSideProps } from 'next'
import useTranslation from 'next-translate/useTranslation'

import { Clock, Calendar } from 'lucide-react'
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

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed')
                        observer.unobserve(entry.target)
                    }
                })
            },
            { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
        )
        document
            .querySelectorAll('.reveal-on-scroll')
            .forEach((el) => observer.observe(el))
        return () => observer.disconnect()
    }, [articles])

    return (
        <div
            className="flex w-full flex-col overflow-x-hidden"
            style={{
                backgroundImage:
                    'radial-gradient(circle, rgba(144, 202, 249, 0.035) 1px, transparent 1px)',
                backgroundSize: '32px 32px',
            }}
        >
            <style>{`
                .reveal-on-scroll {
                    opacity: 0;
                    transform: translateY(28px);
                    transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
                                transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .reveal-on-scroll.revealed {
                    opacity: 1;
                    transform: translateY(0);
                }
                .reveal-child {
                    opacity: 0;
                    transform: translateY(16px);
                    transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
                                transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .revealed .reveal-child {
                    opacity: 1;
                    transform: translateY(0);
                }
            `}</style>

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
                    content="https://juicify.whoisarjen.com/blog"
                />
                <meta
                    property="og:image"
                    content="https://juicify.whoisarjen.com/images/logo.png"
                />
            </Head>

            {/* Floating ambient orb */}
            <div
                className="pointer-events-none fixed right-[5%] top-[20%] h-[220px] w-[220px] rounded-full opacity-[0.08] blur-[80px] will-change-transform md:h-[360px] md:w-[360px] md:blur-[120px]"
                style={{
                    background:
                        'radial-gradient(circle, #90caf9, #42a5f5, transparent)',
                }}
            />

            {/* Page Header */}
            <section className="relative px-6 pt-8 pb-4">
                <div className="mx-auto max-w-6xl">
                    <h1 className="text-3xl font-bold text-white md:text-4xl">
                        {t('LATEST_NEWS')}
                    </h1>
                    <div className="mt-3 h-1 w-12 rounded-full bg-[#90caf9]/40" />
                </div>
            </section>

            {/* Loading State */}
            {isPageLoading && (
                <section className="px-6 py-4">
                    <div className="mx-auto flex max-w-6xl flex-col gap-6">
                        <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                            <div className="h-[320px] animate-pulse bg-white/[0.04]" />
                            <div className="p-5">
                                <div className="mb-3 h-7 w-20 animate-pulse rounded-full bg-white/[0.06]" />
                                <div className="mb-3 h-9 w-[70%] animate-pulse rounded bg-white/[0.04]" />
                                <div className="mb-2 h-5 w-[90%] animate-pulse rounded bg-white/[0.03]" />
                                <div className="h-5 w-[60%] animate-pulse rounded bg-white/[0.03]" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                                    <div className="h-[180px] animate-pulse bg-white/[0.04]" />
                                    <div className="p-4">
                                        <div className="mb-3 h-6 w-16 animate-pulse rounded-full bg-white/[0.06]" />
                                        <div className="mb-2 h-7 w-[80%] animate-pulse rounded bg-white/[0.04]" />
                                        <div className="mb-2 h-[18px] w-full animate-pulse rounded bg-white/[0.03]" />
                                        <div className="h-[18px] w-[40%] animate-pulse rounded bg-white/[0.03]" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Empty State */}
            {!isPageLoading && articles.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20">
                    <p className="text-lg text-gray-500">
                        {t('NO_ARTICLES')}
                    </p>
                </div>
            )}

            {/* Content */}
            {!isPageLoading && articles.length > 0 && (
                <>
                    {/* Featured Article (Hero) */}
                    {featuredArticle && page === 1 && (
                        <section className="px-6 py-4">
                            <div className="reveal-on-scroll mx-auto max-w-6xl">
                                <Link
                                    href={`/blog/${featuredArticle.slug}`}
                                    className="group block"
                                >
                                    <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.12] hover:bg-white/[0.04]">
                                        {featuredArticle.featuredImageUrl && (
                                            <img
                                                src={featuredArticle.featuredImageUrl}
                                                alt={
                                                    featuredArticle.featuredImageAlt ||
                                                    featuredArticle.title
                                                }
                                                className="h-[220px] w-full object-cover md:h-[360px]"
                                            />
                                        )}
                                        <div className="p-4 md:p-5">
                                            <div className="mb-3 flex flex-wrap items-center gap-2">
                                                {featuredArticle.niche && (
                                                    <span className="rounded-full bg-[#90caf9]/10 px-3 py-1 text-xs font-semibold text-[#90caf9]">
                                                        {t(`NICHE_${featuredArticle.niche}`)}
                                                    </span>
                                                )}
                                            </div>
                                            <h2 className="mb-2 line-clamp-2 text-xl font-bold text-white md:text-2xl">
                                                {featuredArticle.title}
                                            </h2>
                                            <p className="mb-4 text-sm leading-relaxed text-gray-400 line-clamp-2">
                                                {featuredArticle.excerpt}
                                            </p>
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                {featuredArticle.readingTimeMinutes > 0 && (
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={14} />
                                                        {t('MINUTES_READ', {
                                                            count: featuredArticle.readingTimeMinutes,
                                                        })}
                                                    </span>
                                                )}
                                                {featuredArticle.publishedAt && (
                                                    <span className="flex items-center gap-1">
                                                        <Calendar size={14} />
                                                        {moment(
                                                            featuredArticle.publishedAt
                                                        ).format('MMM D, YYYY')}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </section>
                    )}

                    {/* Articles Grid */}
                    {(page === 1 ? gridArticles : articles).length > 0 && (
                        <section className="px-6 py-6">
                            <div className="reveal-on-scroll mx-auto max-w-6xl">
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                    {(page === 1 ? gridArticles : articles).map(
                                        (article, i) => (
                                            <Link
                                                key={article.slug}
                                                href={`/blog/${article.slug}`}
                                                className="group block"
                                            >
                                                <div
                                                    className="reveal-child flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.12] hover:bg-white/[0.04]"
                                                    style={{ transitionDelay: `${i * 80}ms` }}
                                                >
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
                                                    <div className="flex flex-1 flex-col p-4">
                                                        <div className="mb-2 flex flex-wrap items-center gap-2">
                                                            {article.niche && (
                                                                <span className="rounded-full bg-[#90caf9]/10 px-2.5 py-0.5 text-[0.7rem] font-semibold text-[#90caf9]">
                                                                    {t(`NICHE_${article.niche}`)}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <h2 className="mb-1 line-clamp-2 text-base font-bold leading-[1.3] text-white">
                                                            {article.title}
                                                        </h2>
                                                        <p className="mb-auto pb-3 text-sm leading-relaxed text-gray-400 line-clamp-2">
                                                            {article.excerpt}
                                                        </p>
                                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                                            {article.readingTimeMinutes > 0 && (
                                                                <span className="flex items-center gap-1">
                                                                    <Clock size={14} />
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
                                                                    <Calendar size={14} />
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
                            </div>
                        </section>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <section className="px-6 pb-8 pt-4">
                            <div className="mx-auto flex max-w-6xl justify-center gap-2">
                                <button
                                    onClick={() => setPage(page - 1)}
                                    disabled={page === 1}
                                    className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-sm text-gray-400 transition-all hover:border-white/[0.12] hover:bg-white/[0.04] disabled:opacity-30 disabled:hover:border-white/[0.06] disabled:hover:bg-white/[0.02]"
                                >
                                    &lsaquo;
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setPage(p)}
                                        className={`min-w-[40px] rounded-xl border px-3 py-2 text-sm transition-all ${
                                            p === page
                                                ? 'border-[#90caf9]/30 bg-[#90caf9]/10 text-[#90caf9]'
                                                : 'border-white/[0.06] bg-white/[0.02] text-gray-400 hover:border-white/[0.12] hover:bg-white/[0.04]'
                                        }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setPage(page + 1)}
                                    disabled={page === totalPages}
                                    className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-sm text-gray-400 transition-all hover:border-white/[0.12] hover:bg-white/[0.04] disabled:opacity-30 disabled:hover:border-white/[0.06] disabled:hover:bg-white/[0.02]"
                                >
                                    &rsaquo;
                                </button>
                            </div>
                        </section>
                    )}
                </>
            )}
        </div>
    )
}

export default BlogPage
