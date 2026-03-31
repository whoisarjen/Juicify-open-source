import Head from 'next/head'
import Link from 'next/link'
import { type GetServerSideProps } from 'next'
import useTranslation from 'next-translate/useTranslation'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import MuiLink from '@mui/material/Link'
import Chip from '@mui/material/Chip'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
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
    const canonicalUrl = `https://juicify.app/blog/${article.slug}`

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
                url: 'https://juicify.app/images/logo.png',
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
                item: 'https://juicify.app',
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Blog',
                item: 'https://juicify.app/blog',
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
                    <ArrowBackIcon sx={{ fontSize: 16 }} />
                    {t('BACK_TO_BLOG')}
                </Link>

                {/* Breadcrumbs */}
                <Breadcrumbs
                    aria-label="breadcrumb"
                    sx={{ mb: 3, fontSize: '0.85rem' }}
                >
                    <Link href="/" passHref legacyBehavior>
                        <MuiLink
                            underline="hover"
                            color="text.secondary"
                            sx={{ fontSize: 'inherit' }}
                        >
                            Home
                        </MuiLink>
                    </Link>
                    <Link href="/blog" passHref legacyBehavior>
                        <MuiLink
                            underline="hover"
                            color="text.secondary"
                            sx={{ fontSize: 'inherit' }}
                        >
                            Blog
                        </MuiLink>
                    </Link>
                    <Typography
                        color="text.primary"
                        sx={{
                            fontSize: 'inherit',
                            maxWidth: 300,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {article.title}
                    </Typography>
                </Breadcrumbs>

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
                <Typography
                    variant="h3"
                    component="h1"
                    className="!mb-4 !font-bold"
                    sx={{
                        fontSize: { xs: '1.75rem', md: '2.5rem' },
                        lineHeight: 1.2,
                    }}
                >
                    {article.title}
                </Typography>

                {/* Meta Bar */}
                <div className="mb-8 flex flex-wrap items-center gap-4 text-sm text-gray-400">
                    {article.publishedAt && (
                        <span className="flex items-center gap-1">
                            <CalendarTodayIcon sx={{ fontSize: 16 }} />
                            {t('PUBLISHED')}{' '}
                            {moment(article.publishedAt).format('MMM D, YYYY')}
                        </span>
                    )}
                    {article.readingTimeMinutes > 0 && (
                        <span className="flex items-center gap-1">
                            <AccessTimeIcon sx={{ fontSize: 16 }} />
                            {t('MINUTES_READ', {
                                count: article.readingTimeMinutes,
                            })}
                        </span>
                    )}
                    {article.niche && (
                        <Chip
                            label={t(`NICHE_${article.niche}`)}
                            size="small"
                            sx={{
                                bgcolor: 'rgba(144, 202, 249, 0.12)',
                                color: '#90caf9',
                                fontWeight: 600,
                                fontSize: '0.75rem',
                            }}
                        />
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
                        <Typography
                            variant="h5"
                            component="h2"
                            className="!mb-4 !font-bold"
                        >
                            {t('REFERENCES')}
                        </Typography>
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
                        <Typography
                            variant="h5"
                            component="h2"
                            className="!mb-4 !font-bold"
                        >
                            {t('FAQ')}
                        </Typography>
                        <div className="space-y-2">
                            {article.faqs.map((faq, i) => (
                                <Accordion
                                    key={i}
                                    sx={{
                                        bgcolor: 'rgba(255,255,255,0.02)',
                                        border: '1px solid rgba(255,255,255,0.06)',
                                        borderRadius: '12px !important',
                                        '&:before': { display: 'none' },
                                        '&.Mui-expanded': { margin: 0 },
                                    }}
                                >
                                    <AccordionSummary
                                        expandIcon={
                                            <ExpandMoreIcon
                                                sx={{ color: '#90caf9' }}
                                            />
                                        }
                                        sx={{
                                            fontWeight: 600,
                                            fontSize: '0.95rem',
                                        }}
                                    >
                                        {faq.question}
                                    </AccordionSummary>
                                    <AccordionDetails
                                        sx={{
                                            color: 'text.secondary',
                                            fontSize: '0.9rem',
                                            lineHeight: 1.7,
                                        }}
                                    >
                                        {faq.answer}
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </div>
                    </div>
                )}

                {/* Related Articles */}
                {article.relatedArticles.length > 0 && (
                    <div className="mt-12 border-t border-white/10 pt-8">
                        <Typography
                            variant="h5"
                            component="h2"
                            className="!mb-6 !font-bold"
                        >
                            {t('RELATED_ARTICLES')}
                        </Typography>
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {article.relatedArticles.map((related) => (
                                <Link
                                    key={related.slug}
                                    href={`/blog/${related.slug}`}
                                    className="group block"
                                >
                                    <Card
                                        sx={{
                                            bgcolor: 'background.paper',
                                            borderRadius: 3,
                                            overflow: 'hidden',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            transition:
                                                'transform 0.2s ease, box-shadow 0.2s ease',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow:
                                                    '0 8px 30px rgba(0,0,0,0.3)',
                                            },
                                        }}
                                    >
                                        {related.featuredImageUrl && (
                                            <CardMedia
                                                component="img"
                                                height={180}
                                                image={
                                                    related.featuredImageUrl
                                                }
                                                alt={
                                                    related.featuredImageAlt ||
                                                    related.title
                                                }
                                                sx={{
                                                    height: 180,
                                                    objectFit: 'cover',
                                                }}
                                            />
                                        )}
                                        <CardContent
                                            sx={{
                                                p: 2.5,
                                                flex: 1,
                                                display: 'flex',
                                                flexDirection: 'column',
                                            }}
                                        >
                                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                                {related.niche && (
                                                    <Chip
                                                        label={t(
                                                            `NICHE_${related.niche}`
                                                        )}
                                                        size="small"
                                                        sx={{
                                                            bgcolor:
                                                                'rgba(144, 202, 249, 0.12)',
                                                            color: '#90caf9',
                                                            fontWeight: 600,
                                                            fontSize: '0.7rem',
                                                        }}
                                                    />
                                                )}
                                            </div>
                                            <Typography
                                                variant="subtitle1"
                                                component="h3"
                                                className="!mb-1 !font-bold"
                                                sx={{
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    lineHeight: 1.3,
                                                }}
                                            >
                                                {related.title}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                className="!text-gray-400"
                                                sx={{
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    mb: 'auto',
                                                    pb: 1.5,
                                                }}
                                            >
                                                {related.excerpt}
                                            </Typography>
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                {related.readingTimeMinutes >
                                                    0 && (
                                                    <span className="flex items-center gap-1">
                                                        <AccessTimeIcon
                                                            sx={{
                                                                fontSize: 14,
                                                            }}
                                                        />
                                                        {t('MINUTES_READ', {
                                                            count: related.readingTimeMinutes,
                                                        })}
                                                    </span>
                                                )}
                                                {related.publishedAt && (
                                                    <span className="flex items-center gap-1">
                                                        <CalendarTodayIcon
                                                            sx={{
                                                                fontSize: 14,
                                                            }}
                                                        />
                                                        {moment(
                                                            related.publishedAt
                                                        ).format(
                                                            'MMM D, YYYY'
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
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
                        <ArrowBackIcon sx={{ fontSize: 16 }} />
                        {t('BACK_TO_BLOG')}
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ArticlePage
