import Head from 'next/head'
import Link from 'next/link'
import { type GetServerSideProps } from 'next'
import useTranslation from 'next-translate/useTranslation'

import { Clock, Calendar, ArrowLeft } from 'lucide-react'
import moment from 'moment'
import { prisma } from '@/server/db/client'
import {
    resolveArticleLocale,
    resolveArticleListItem,
} from '@/server/common/articleLocale'

type ArticlePageProps = {
    article: {
        slug: string
        title: string
        excerpt: string
        content: string
        metaTitle: string | null
        metaDesc: string | null
        featuredImageUrl: string | null
        featuredImageAlt: string | null
        featuredImageOwnerName: string | null
        featuredImageOwnerUsername: string | null
        readingTimeMinutes: number
        publishedAt: string
        niche: string | null
        references: Array<{ title: string; url: string; source: string }>
        faqs: Array<{ question: string; answer: string }>
        relatedArticles: Array<{
            slug: string
            title: string
            excerpt: string
            featuredImageUrl: string | null
            featuredImageAlt: string | null
            readingTimeMinutes: number
            publishedAt: string
            niche: string | null
        }>
    }
    locale: string
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const slug = context.params?.slug as string
    const locale = context.locale || 'en'

    const article = await prisma.article.findFirst({
        where: { slug, isPublished: true },
    })

    if (!article) return { notFound: true }

    const resolved = resolveArticleLocale(article, locale)

    // Related articles (2-3 from same niche, fallback to other niches)
    const relatedRaw = await prisma.article.findMany({
        where: {
            isPublished: true,
            slug: { not: slug },
            ...(article.niche ? { niche: article.niche } : {}),
        },
        orderBy: { publishedAt: 'desc' },
        take: 3,
    })

    let related = relatedRaw
    if (related.length < 2) {
        const more = await prisma.article.findMany({
            where: {
                isPublished: true,
                slug: {
                    notIn: [slug, ...related.map((r) => r.slug)],
                },
            },
            orderBy: { publishedAt: 'desc' },
            take: 3 - related.length,
        })
        related = [...related, ...more]
    }

    return {
        props: {
            article: JSON.parse(
                JSON.stringify({
                    ...resolved,
                    relatedArticles: related.map((a) =>
                        resolveArticleListItem(a, locale)
                    ),
                })
            ),
            locale,
        },
    }
}

const ArticlePage = ({ article, locale }: ArticlePageProps) => {
    const { t } = useTranslation('blog')

    const pageTitle = article.metaTitle || article.title
    const pageDescription = article.metaDesc || article.excerpt
    const canonicalUrl = `https://juicify.whoisarjen.com/blog/${article.slug}`

    const articleJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: article.excerpt,
        image: article.featuredImageUrl || undefined,
        datePublished: article.publishedAt,
        publisher: {
            '@type': 'Organization',
            name: 'Juicify',
            logo: {
                '@type': 'ImageObject',
                url: 'https://juicify.whoisarjen.com/images/logo.png',
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': canonicalUrl,
        },
    }

    const faqJsonLd =
        article.faqs.length > 0
            ? {
                  '@context': 'https://schema.org',
                  '@type': 'FAQPage',
                  mainEntity: article.faqs.map((faq) => ({
                      '@type': 'Question',
                      name: faq.question,
                      acceptedAnswer: {
                          '@type': 'Answer',
                          text: faq.answer,
                      },
                  })),
              }
            : null

    const breadcrumbJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://juicify.whoisarjen.com',
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Blog',
                item: 'https://juicify.whoisarjen.com/blog',
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: article.title,
                item: canonicalUrl,
            },
        ],
    }

    return (
        <div className="flex w-full flex-col">
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <link rel="canonical" href={canonicalUrl} />

                {/* Open Graph */}
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={canonicalUrl} />
                {article.featuredImageUrl && (
                    <meta
                        property="og:image"
                        content={article.featuredImageUrl}
                    />
                )}

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={pageTitle} />
                <meta name="twitter:description" content={pageDescription} />
                {article.featuredImageUrl && (
                    <meta
                        name="twitter:image"
                        content={article.featuredImageUrl}
                    />
                )}

                {/* Schema.org JSON-LD */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(articleJsonLd),
                    }}
                />
                {faqJsonLd && (
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify(faqJsonLd),
                        }}
                    />
                )}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(breadcrumbJsonLd),
                    }}
                />
            </Head>

            <div className="mx-auto w-full max-w-4xl py-6">
                {/* Back to Blog */}
                <Link
                    href="/blog"
                    className="mb-6 inline-flex items-center gap-1 text-sm text-[#90caf9] transition-colors hover:text-[#64b5f6]"
                >
                    <ArrowLeft size={16} />
                    {t('BACK_TO_BLOG')}
                </Link>

                {/* Breadcrumbs */}
                <nav aria-label="breadcrumb" className="mb-6 text-[0.85rem]">
                    <ol className="flex items-center gap-1 text-gray-400">
                        <li>
                            <Link href="/" className="hover:underline">
                                Home
                            </Link>
                        </li>
                        <li>/</li>
                        <li>
                            <Link href="/blog" className="hover:underline">
                                Blog
                            </Link>
                        </li>
                        <li>/</li>
                        <li className="max-w-[300px] truncate text-gray-200">
                            {article.title}
                        </li>
                    </ol>
                </nav>

                {/* Hero Image */}
                {article.featuredImageUrl && (
                    <div className="mb-6 overflow-hidden rounded-2xl">
                        <img
                            src={article.featuredImageUrl}
                            alt={article.featuredImageAlt || article.title}
                            className="h-auto w-full object-cover"
                            style={{ maxHeight: 480 }}
                        />
                        {article.featuredImageOwnerName && (
                            <p className="mt-2 text-xs text-gray-500">
                                Photo by{' '}
                                {article.featuredImageOwnerUsername ? (
                                    <a
                                        href={`https://unsplash.com/@${article.featuredImageOwnerUsername}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#90caf9] underline hover:text-[#64b5f6]"
                                    >
                                        {article.featuredImageOwnerName}
                                    </a>
                                ) : (
                                    article.featuredImageOwnerName
                                )}{' '}
                                on{' '}
                                <a
                                    href="https://unsplash.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#90caf9] underline hover:text-[#64b5f6]"
                                >
                                    Unsplash
                                </a>
                            </p>
                        )}
                    </div>
                )}

                {/* Article Title */}
                <h1 className="mb-4 text-[1.75rem] font-bold leading-[1.2] md:text-[2.5rem]">
                    {article.title}
                </h1>

                {/* Meta Bar */}
                <div className="mb-8 flex flex-wrap items-center gap-4 text-sm text-gray-400">
                    {article.publishedAt && (
                        <span className="flex items-center gap-1">
                            <Calendar size={16} />
                            {t('PUBLISHED')}{' '}
                            {moment(article.publishedAt).format('MMM D, YYYY')}
                        </span>
                    )}
                    {article.readingTimeMinutes > 0 && (
                        <span className="flex items-center gap-1">
                            <Clock size={16} />
                            {t('MINUTES_READ', {
                                count: article.readingTimeMinutes,
                            })}
                        </span>
                    )}
                    {article.niche && (
                        <span className="rounded-full bg-[#90caf9]/10 px-2.5 py-0.5 text-xs font-semibold text-[#90caf9]">
                            {t(`NICHE_${article.niche}`)}
                        </span>
                    )}
                </div>

                {/* Article Content */}
                <div
                    className="prose max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                />

                {/* References */}
                {article.references.length > 0 && (
                    <div className="mt-12 border-t border-white/10 pt-8">
                        <h2 className="mb-4 text-xl font-bold">
                            {t('REFERENCES')}
                        </h2>
                        <ol className="list-decimal space-y-2 pl-6 text-sm text-gray-400">
                            {article.references.map((ref, i) => (
                                <li key={i}>
                                    <a
                                        href={ref.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#90caf9] underline hover:text-[#64b5f6]"
                                    >
                                        {ref.title}
                                    </a>
                                    {ref.source && (
                                        <span className="text-gray-500">
                                            {' '}
                                            — {ref.source}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ol>
                    </div>
                )}

                {/* FAQ */}
                {article.faqs.length > 0 && (
                    <div className="mt-12 border-t border-white/10 pt-8">
                        <h2 className="mb-4 text-xl font-bold">
                            {t('FAQ')}
                        </h2>
                        <div className="space-y-2">
                            {article.faqs.map((faq, i) => (
                                <details
                                    key={i}
                                    className="group rounded-xl border border-white/5 bg-white/[0.02]"
                                >
                                    <summary className="flex cursor-pointer items-center justify-between p-4 text-[0.95rem] font-semibold [&::-webkit-details-marker]:hidden">
                                        {faq.question}
                                        <svg
                                            className="h-5 w-5 shrink-0 text-[#90caf9] transition-transform group-open:rotate-180"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <polyline points="6 9 12 15 18 9" />
                                        </svg>
                                    </summary>
                                    <div className="px-4 pb-4 text-[0.9rem] leading-[1.7] text-gray-400">
                                        {faq.answer}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>
                )}

                {/* Related Articles */}
                {article.relatedArticles.length > 0 && (
                    <div className="mt-12 border-t border-white/10 pt-8">
                        <h2 className="mb-6 text-xl font-bold">
                            {t('RELATED_ARTICLES')}
                        </h2>
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {article.relatedArticles.map((related) => (
                                <Link
                                    key={related.slug}
                                    href={`/blog/${related.slug}`}
                                    className="group block"
                                >
                                    <div className="flex h-full flex-col overflow-hidden rounded-xl bg-white shadow transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] dark:bg-gray-800">
                                        {related.featuredImageUrl && (
                                            <img
                                                src={related.featuredImageUrl}
                                                alt={
                                                    related.featuredImageAlt ||
                                                    related.title
                                                }
                                                className="h-[180px] w-full object-cover"
                                            />
                                        )}
                                        <div className="flex flex-1 flex-col p-2.5">
                                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                                {related.niche && (
                                                    <span className="rounded-full bg-[#90caf9]/10 px-2.5 py-0.5 text-[0.7rem] font-semibold text-[#90caf9]">
                                                        {t(`NICHE_${related.niche}`)}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="mb-1 line-clamp-2 text-base font-bold leading-[1.3]">
                                                {related.title}
                                            </h3>
                                            <p className="mb-auto pb-3 text-sm text-gray-400 line-clamp-2">
                                                {related.excerpt}
                                            </p>
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                {related.readingTimeMinutes >
                                                    0 && (
                                                    <span className="flex items-center gap-1">
                                                        <Clock
                                                            size={14}
                                                        />
                                                        {t('MINUTES_READ', {
                                                            count: related.readingTimeMinutes,
                                                        })}
                                                    </span>
                                                )}
                                                {related.publishedAt && (
                                                    <span className="flex items-center gap-1">
                                                        <Calendar
                                                            size={14}
                                                        />
                                                        {moment(
                                                            related.publishedAt
                                                        ).format(
                                                            'MMM D, YYYY'
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Bottom Back to Blog */}
                <div className="mt-12 border-t border-white/10 pt-6">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-1 text-sm text-[#90caf9] transition-colors hover:text-[#64b5f6]"
                    >
                        <ArrowLeft size={16} />
                        {t('BACK_TO_BLOG')}
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ArticlePage
