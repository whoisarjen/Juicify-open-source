import { type Article } from '@prisma/client'

const LOCALE_SUFFIX_MAP: Record<string, string> = {
    en: 'En',
    pl: 'Pl',
    es: 'Es',
    de: 'De',
    pt: 'Pt',
    fr: 'Fr',
    ko: 'Ko',
    ar: 'Ar',
    tr: 'Tr',
    ja: 'Ja',
    it: 'It',
}

type LocaleField = 'title' | 'excerpt' | 'content' | 'metaTitle' | 'metaDesc'

function getLocalizedField(
    article: Article,
    field: LocaleField,
    locale: string
): string | null {
    const suffix = LOCALE_SUFFIX_MAP[locale] || 'En'
    const key = `${field}${suffix}` as keyof Article
    const value = article[key] as string | null

    // Fallback to English if locale field is empty
    if (!value && suffix !== 'En') {
        const enKey = `${field}En` as keyof Article
        return article[enKey] as string | null
    }

    return value
}

type FaqItem = {
    questionEn?: string
    answerEn?: string
    [key: string]: string | undefined
}

function getLocalizedFaqs(
    faqs: FaqItem[] | null | undefined,
    locale: string
): Array<{ question: string; answer: string }> {
    if (!faqs || !Array.isArray(faqs)) return []

    const suffix = LOCALE_SUFFIX_MAP[locale] || 'En'

    return faqs
        .map((faq) => {
            const question =
                faq[`question${suffix}`] || faq.questionEn || ''
            const answer =
                faq[`answer${suffix}`] || faq.answerEn || ''
            return { question, answer }
        })
        .filter((faq) => faq.question && faq.answer)
}

type ReferenceItem = {
    title: string
    url: string
    source: string
}

export function resolveArticleLocale(article: Article, locale: string) {
    return {
        slug: article.slug,
        title: getLocalizedField(article, 'title', locale) || '',
        excerpt: getLocalizedField(article, 'excerpt', locale) || '',
        content: getLocalizedField(article, 'content', locale) || '',
        metaTitle: getLocalizedField(article, 'metaTitle', locale),
        metaDesc: getLocalizedField(article, 'metaDesc', locale),
        featuredImageUrl: article.featuredImageUrl,
        featuredImageAlt: article.featuredImageAlt,
        featuredImageOwnerName: article.featuredImageOwnerName,
        featuredImageOwnerUsername: article.featuredImageOwnerUsername,
        readingTimeMinutes: article.readingTimeMinutes,
        publishedAt: article.publishedAt,
        niche: article.niche,
        references: (article.references as ReferenceItem[] | null) || [],
        faqs: getLocalizedFaqs(article.faqs as FaqItem[] | null, locale),
    }
}

export function resolveArticleListItem(article: Article, locale: string) {
    return {
        slug: article.slug,
        title: getLocalizedField(article, 'title', locale) || '',
        excerpt: getLocalizedField(article, 'excerpt', locale) || '',
        featuredImageUrl: article.featuredImageUrl,
        featuredImageAlt: article.featuredImageAlt,
        readingTimeMinutes: article.readingTimeMinutes,
        publishedAt: article.publishedAt,
        niche: article.niche,
    }
}
