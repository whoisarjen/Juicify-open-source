# Blog System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a database-driven, 11-language blog to Juicify with automated AI content pipeline and PubMed citations.

**Architecture:** Column-per-language Article model in existing Prisma/Neon PostgreSQL, tRPC public endpoints with locale-resolved responses, Next.js Pages Router with SSR blog pages (MUI + Tailwind + `@tailwindcss/typography`), Next.js middleware to restrict 9 new locales to blog-only routes, and a `/content N` slash command for automated article generation.

**Tech Stack:** Next.js 13 Pages Router, tRPC 10, Prisma 5, Neon PostgreSQL, MUI 5, Tailwind CSS 3, next-translate, Zod

**Spec:** `docs/superpowers/specs/2026-03-19-blog-system-design.md`

---

## File Structure

### New Files
| File | Responsibility |
|------|---------------|
| `src/server/schema/article.schema.ts` | Zod input schemas for article tRPC procedures |
| `src/server/trpc/router/article.ts` | tRPC router: `list`, `getBySlug`, `sitemap` |
| `src/server/common/articleLocale.ts` | Helper to resolve locale-specific columns + English fallback |
| `src/pages/blog/index.tsx` | Blog listing page (SSR) |
| `src/pages/blog/[slug].tsx` | Article detail page (SSR) |
| `src/middleware.ts` | Next.js middleware: redirect non-blog pages under new locales |
| `locales/{es,de,pt,fr,ko,ar,tr,ja,it}/home.json` | Minimal home translations for new locales (nav labels) |
| `locales/{es,de,pt,fr,ko,ar,tr,ja,it}/blog.json` | Blog UI translations for new locales |
| `.claude/commands/content.md` | Content batch orchestrator command |
| `.claude/agents/juicify-content-writer.md` | EN content writer agent |
| `.claude/agents/juicify-keyword-analyst.md` | Keyword picker agent with nutrition niches |

### Modified Files
| File | Change |
|------|--------|
| `prisma/schema.prisma` | Article model (already added) |
| `src/server/trpc/router/_app.ts` | Register `articleRouter` |
| `i18n.json` | Add 11 locales + `/blog/[slug]` route (preserve all existing routes) |
| `next.config.js` | Add `images.unsplash.com` to domains (locales controlled by i18n.json via next-translate) |
| `src/pages/api/sitemap.ts` | Add article URLs with hreflang alternates |
| `src/layout/SidebarLeft.tsx` | Make blog link work for unauthenticated users |
| `locales/en/blog.json` | Replace placeholder with full blog UI translations |
| `locales/pl/blog.json` | Replace placeholder with full blog UI translations |

---

## Task 1: i18n & Next.js Config Expansion

**Files:**
- Modify: `next.config.js`
- Modify: `i18n.json`

- [ ] **Step 1: Update `next.config.js` — add Unsplash image domain only**

`next-translate-plugin` reads locales from `i18n.json` and generates the `i18n` config automatically via `...nextTranslate()`. Do NOT add an explicit `i18n` block to `next.config.js` — it would be overwritten by the spread. Only add the Unsplash image domain:

```javascript
/** @type {import("next").NextConfig} */

const nextTranslate = require('next-translate-plugin');

const isProduction = process.env.NODE_ENV === 'production'

const withPWA = require("next-pwa")({
    dest: 'public',
    disable: !isProduction,
    register: isProduction,
    skipWaiting: isProduction,
})

const nextConfig = {
    reactStrictMode: false, // react-beautiful-dnd is not working, when true
    images: {
        domains: [
            'localhost',
            'juicify.app',
            'images.unsplash.com',
        ],
    },
    ...nextTranslate(),
    async redirects() {
        return [
            {
                source: '/sitemap.xml',
                destination: '/api/sitemap',
                permanent: true,
            },
        ]
    },
}

module.exports = withPWA(nextConfig);
```

- [ ] **Step 2: Update `i18n.json` — add 11 locales and `/blog/[slug]` route**

**CRITICAL:** Preserve ALL existing page-to-namespace mappings. The only changes are: (1) expand locales to 11, (2) rename `/blog/[url]` to `/blog/[slug]`.

```json
{
    "locales": ["en", "pl", "es", "de", "pt", "fr", "ko", "ar", "tr", "ja", "it"],
    "defaultLocale": "en",
    "pages": {
        "*": ["home"],
        "/barcode": ["nutrition-diary"],
        "/[login]/consumed/[date]": ["nutrition-diary"],
        "/[login]/workout": ["workout"],
        "/[login]/workout/plans": ["workout"],
        "/[login]/workout/plans/[id]": ["workout"],
        "/[login]/workout/results": ["workout"],
        "/[login]/workout/results/[id]": ["workout"],
        "/coach": ["coach"],
        "/macronutrients": ["macronutrients"],
        "/settings": ["settings"],
        "/[login]": ["profile"],
        "/blog": ["blog"],
        "/blog/[slug]": ["blog"]
    }
}
```

- [ ] **Step 3: Verify dev server starts with new locale config**

Run: `npm run dev` and confirm no errors. Visit `http://localhost:3000/es/` — should render the landing page (English fallback). Visit `http://localhost:3000/blog` — should render (empty for now). Kill dev server.

- [ ] **Step 4: Commit**

```bash
git add next.config.js i18n.json
git commit -m "feat(blog): expand i18n to 11 locales and add Unsplash image domain"
```

---

## Task 2: Next.js Middleware for Locale Restriction

**Files:**
- Create: `src/middleware.ts`

- [ ] **Step 1: Create middleware to restrict non-blog pages to en+pl**

```typescript
import { NextRequest, NextResponse } from 'next/server'

const BLOG_ONLY_LOCALES = ['es', 'de', 'pt', 'fr', 'ko', 'ar', 'tr', 'ja', 'it']

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const locale = request.nextUrl.locale

    // Only intercept the 9 new locales (not en/pl)
    if (!locale || !BLOG_ONLY_LOCALES.includes(locale)) {
        return NextResponse.next()
    }

    // Allow blog routes for all 11 locales
    if (pathname.startsWith('/blog')) {
        return NextResponse.next()
    }

    // Allow API routes and static assets
    if (
        pathname.startsWith('/api') ||
        pathname.startsWith('/_next') ||
        pathname.includes('.')
    ) {
        return NextResponse.next()
    }

    // Redirect non-blog pages to English version
    const url = request.nextUrl.clone()
    url.locale = 'en'
    return NextResponse.redirect(url)
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

- [ ] **Step 2: Verify middleware works**

Run: `npm run dev`. Visit `http://localhost:3000/es/settings` — should redirect to `/settings`. Visit `http://localhost:3000/es/blog` — should stay on `/es/blog`. Kill dev server.

- [ ] **Step 3: Commit**

```bash
git add src/middleware.ts
git commit -m "feat(blog): add middleware to restrict new locales to blog routes only"
```

---

## Task 3: Blog Translation Files

**Files:**
- Modify: `locales/en/blog.json`
- Modify: `locales/pl/blog.json`
- Create: `locales/{es,de,pt,fr,ko,ar,tr,ja,it}/blog.json`
- Create: `locales/{es,de,pt,fr,ko,ar,tr,ja,it}/home.json`

- [ ] **Step 1: Replace `locales/en/blog.json` with full translations**

```json
{
    "LATEST_NEWS": "Latest Articles",
    "BACK_TO_BLOG": "Back to Blog",
    "READ_MORE": "Read more",
    "MINUTES_READ": "{{count}} min read",
    "PUBLISHED": "Published",
    "RELATED_ARTICLES": "Related Articles",
    "REFERENCES": "References",
    "FAQ": "Frequently Asked Questions",
    "NO_ARTICLES": "No articles yet. Check back soon!",
    "PAGE": "Page",
    "OF": "of",
    "PREVIOUS": "Previous",
    "NEXT": "Next",
    "NICHE_nutrition-science": "Nutrition Science",
    "NICHE_diet-guide": "Diet Guide",
    "NICHE_weight-management": "Weight Management",
    "NICHE_exercise-science": "Exercise Science",
    "NICHE_food-myths": "Food Myths",
    "NICHE_supplement-review": "Supplement Review",
    "NICHE_meal-planning": "Meal Planning",
    "NICHE_body-composition": "Body Composition",
    "NICHE_fitness-for-beginners": "Fitness for Beginners",
    "NICHE_sport-nutrition": "Sport Nutrition"
}
```

- [ ] **Step 2: Create `locales/pl/blog.json`**

```json
{
    "LATEST_NEWS": "Najnowsze artykuly",
    "BACK_TO_BLOG": "Powrot do bloga",
    "READ_MORE": "Czytaj wiecej",
    "MINUTES_READ": "{{count}} min czytania",
    "PUBLISHED": "Opublikowano",
    "RELATED_ARTICLES": "Powiazane artykuly",
    "REFERENCES": "Zrodla",
    "FAQ": "Czesto zadawane pytania",
    "NO_ARTICLES": "Brak artykulow. Wkrotce sie pojawia!",
    "PAGE": "Strona",
    "OF": "z",
    "PREVIOUS": "Poprzednia",
    "NEXT": "Nastepna",
    "NICHE_nutrition-science": "Nauka o zywieniu",
    "NICHE_diet-guide": "Przewodnik po dietach",
    "NICHE_weight-management": "Zarzadzanie waga",
    "NICHE_exercise-science": "Nauka o cwiczeniach",
    "NICHE_food-myths": "Mity zywieniowe",
    "NICHE_supplement-review": "Przeglad suplementow",
    "NICHE_meal-planning": "Planowanie posilkow",
    "NICHE_body-composition": "Kompozycja ciala",
    "NICHE_fitness-for-beginners": "Fitness dla poczatkujacych",
    "NICHE_sport-nutrition": "Zywienie sportowe"
}
```

- [ ] **Step 3: Create blog.json for all 9 remaining locales**

Create `locales/{es,de,pt,fr,ko,ar,tr,ja,it}/blog.json`. Each file follows the same key structure with translations in the respective language.

Also create minimal `home.json` files for these 9 locales. The sidebar uses `useTranslation('home')` and the `*` wildcard loads the `home` namespace on every page. Required keys (check `locales/en/home.json` for the full list, but at minimum):
- `Blog`, `Settings`, `Profile`, `Diary`, `Barcode`, `Measurements`, `Coach`
- `WORKOUT_RESULTS`, `WORKOUT_PLANS`, `WORKOUT_STATISTICS`
- `LOGOUT`, `LOGIN`
- `I_ALSO_WANT_TO_CHANGE_MY_BODY`

Copy the English `home.json` as a base and translate the values.

Use the English translations as the base and translate. For example, `locales/es/blog.json`:
```json
{
    "LATEST_NEWS": "Ultimos articulos",
    "BACK_TO_BLOG": "Volver al blog",
    "READ_MORE": "Leer mas",
    "MINUTES_READ": "{{count}} min de lectura",
    "PUBLISHED": "Publicado",
    "RELATED_ARTICLES": "Articulos relacionados",
    "REFERENCES": "Referencias",
    "FAQ": "Preguntas frecuentes",
    "NO_ARTICLES": "Aun no hay articulos. Vuelve pronto!",
    "PAGE": "Pagina",
    "OF": "de",
    "PREVIOUS": "Anterior",
    "NEXT": "Siguiente",
    "NICHE_nutrition-science": "Ciencia de la nutricion",
    "NICHE_diet-guide": "Guia de dietas",
    "NICHE_weight-management": "Control de peso",
    "NICHE_exercise-science": "Ciencia del ejercicio",
    "NICHE_food-myths": "Mitos alimentarios",
    "NICHE_supplement-review": "Revision de suplementos",
    "NICHE_meal-planning": "Planificacion de comidas",
    "NICHE_body-composition": "Composicion corporal",
    "NICHE_fitness-for-beginners": "Fitness para principiantes",
    "NICHE_sport-nutrition": "Nutricion deportiva"
}
```

Repeat for de, pt, fr, ko, ar, tr, ja, it with proper translations.

- [ ] **Step 4: Commit**

```bash
git add locales/
git commit -m "feat(blog): add blog translations for all 11 locales"
```

---

## Task 4: Article Locale Helper

**Files:**
- Create: `src/server/common/articleLocale.ts`

- [ ] **Step 1: Create locale resolver utility**

This helper maps a locale string to the correct Article model field suffix, selects the right column, and falls back to English.

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add src/server/common/articleLocale.ts
git commit -m "feat(blog): add article locale resolver utility"
```

---

## Task 5: Article Zod Schemas

**Files:**
- Create: `src/server/schema/article.schema.ts`

- [ ] **Step 1: Create Zod input schemas**

```typescript
import { z } from 'zod'

export const articleListSchema = z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(50).default(10),
    niche: z.string().optional(),
    search: z.string().optional(),
    locale: z.string().min(2).max(2).default('en'),
})

export const articleGetBySlugSchema = z.object({
    slug: z.string(),
    locale: z.string().min(2).max(2).default('en'),
})
```

- [ ] **Step 2: Commit**

```bash
git add src/server/schema/article.schema.ts
git commit -m "feat(blog): add article Zod input schemas"
```

---

## Task 6: Article tRPC Router

**Files:**
- Create: `src/server/trpc/router/article.ts`
- Modify: `src/server/trpc/router/_app.ts`

- [ ] **Step 1: Create article router**

```typescript
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

            // Fetch related articles (2-3 from same niche, fallback to other niches)
            const relatedArticles = await ctx.prisma.article.findMany({
                where: {
                    isPublished: true,
                    slug: { not: slug },
                    ...(article.niche ? { niche: article.niche } : {}),
                },
                orderBy: { publishedAt: 'desc' },
                take: 3,
            })

            // If not enough from same niche, fill from other niches
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
```

- [ ] **Step 2: Register article router in `_app.ts`**

Add import and router registration:

```typescript
import { articleRouter } from "./article";
```

Add to the `appRouter`:
```typescript
article: articleRouter,
```

- [ ] **Step 3: Verify router loads**

Run: `npm run dev`. Open browser devtools and check no tRPC errors on load. Kill dev server.

- [ ] **Step 4: Commit**

```bash
git add src/server/trpc/router/article.ts src/server/trpc/router/_app.ts
git commit -m "feat(blog): add article tRPC router with list, getBySlug, and sitemap"
```

---

## Task 7: Blog Listing Page

**Files:**
- Create: `src/pages/blog/index.tsx`
- Modify: `src/layout/SidebarLeft.tsx`

- [ ] **Step 1: Create blog listing page**

Use `@frontend-design` skill to create a polished blog listing page. The page must:

- **Use client-side `trpc.article.list.useQuery()`** to match existing Juicify patterns. The tRPC client is configured with `ssr: true` in `src/utils/trpc.utils.ts`, which means `useQuery` calls are automatically server-rendered on first load — no explicit `getServerSideProps` needed. Add SEO via static `<Head>` tags (title, description, OG) since the listing page SEO is generic, not per-article.
- Display hero section with featured article (first in list)
- Grid of remaining articles (1/2/3 columns responsive)
- Each card: featured image (via `next/image` or `<img>`), niche tag chip, title, excerpt, reading time, date
- Pagination with numbered buttons
- Loading skeletons while data fetches
- Use `useTranslation('blog')` for all labels
- Use `useRouter().locale` to pass locale to tRPC query
- Handle empty state with `NO_ARTICLES` translation
- MUI components (Card, Chip, Skeleton, Pagination) + Tailwind layout

Create at `src/pages/blog/index.tsx`.

- [ ] **Step 2: Fix blog link in SidebarLeft for unauthenticated users**

Currently, clicking any nav link while unauthenticated triggers `signIn()`. Blog should be accessible to everyone. Modify `SidebarLeft.tsx` to allow unauthenticated navigation to `/blog`:

In the `onClick` handler, change the logic so blog link always navigates:

```typescript
onClick={() => {
    if (sessionData?.user || link === '/blog') {
        router.push(link)
    } else {
        signIn()
    }
}}
```

- [ ] **Step 3: Verify blog listing page renders**

Run: `npm run dev`. Visit `http://localhost:3000/blog` — should show empty state ("No articles yet"). Visit while not logged in — should still work. Click blog link in sidebar — should navigate without auth prompt.

- [ ] **Step 4: Commit**

```bash
git add src/pages/blog/index.tsx src/layout/SidebarLeft.tsx
git commit -m "feat(blog): add blog listing page with pagination and fix sidebar auth"
```

---

## Task 8: Article Detail Page

**Files:**
- Create: `src/pages/blog/[slug].tsx`

- [ ] **Step 1: Create article detail page**

Use `@frontend-design` skill to create a polished article detail page. The page must:

- Use `getServerSideProps` to fetch article data for SEO (this page NEEDS SSR for per-article meta tags). Use **direct Prisma queries** with the `resolveArticleLocale` helper — this avoids type mismatches between `GetServerSidePropsContext` and tRPC's `CreateNextContextOptions`. Serialize with `JSON.parse(JSON.stringify(...))` to handle Date objects.
- Dynamic `<Head>` with:
  - `<title>` from `metaTitle` (fallback to `title`)
  - `<meta name="description">` from `metaDesc` (fallback to `excerpt`)
  - OG tags: `og:title`, `og:description`, `og:image` (featuredImageUrl), `og:type` = "article"
  - Twitter card: `twitter:card` = "summary_large_image"
  - Schema.org JSON-LD: `Article` schema + `FAQPage` schema + `BreadcrumbList` schema
- Hero image with Unsplash attribution (photographer name linking to `https://unsplash.com/@{username}`)
- Breadcrumb: Home > Blog > Article Title
- Meta bar: publication date (formatted) + reading time + niche chip
- Article content rendered as HTML inside a `<div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content }} />`
- References section: numbered list of citations with clickable links
- FAQ section: MUI Accordion components, each with question as summary and answer as details
- Related articles: 2-3 cards at the bottom (reuse card component from listing page)
- "Back to Blog" link at top and bottom
- Use `useTranslation('blog')` for labels
- Read locale from `getServerSideProps` context (`context.locale`)

Create at `src/pages/blog/[slug].tsx`.

For `getServerSideProps`, use direct Prisma queries with the locale resolver helper:

```typescript
import { prisma } from '@/server/db/client'
import { resolveArticleLocale, resolveArticleListItem } from '@/server/common/articleLocale'

export const getServerSideProps: GetServerSideProps = async (context) => {
    const slug = context.params?.slug as string
    const locale = context.locale || 'en'

    const article = await prisma.article.findFirst({
        where: { slug, isPublished: true },
    })

    if (!article) return { notFound: true }

    const resolved = resolveArticleLocale(article, locale)

    // Related articles
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
                slug: { notIn: [slug, ...related.map((r) => r.slug)] },
            },
            orderBy: { publishedAt: 'desc' },
            take: 3 - related.length,
        })
        related = [...related, ...more]
    }

    return {
        props: {
            article: JSON.parse(JSON.stringify({
                ...resolved,
                relatedArticles: related.map((a) => resolveArticleListItem(a, locale)),
            })),
            locale,
        },
    }
}
```

- [ ] **Step 2: Verify article page renders**

Since there are no articles yet, test the 404 case. Run: `npm run dev`. Visit `http://localhost:3000/blog/non-existent-slug` — should show Next.js 404 page. Kill dev server.

- [ ] **Step 3: Commit**

```bash
git add src/pages/blog/[slug].tsx
git commit -m "feat(blog): add article detail page with SSR, SEO, and schema.org markup"
```

---

## Task 9: Update Sitemap

**Files:**
- Modify: `src/pages/api/sitemap.ts`

- [ ] **Step 1: Update sitemap to include articles with hreflang**

```typescript
import type { NextApiRequest, NextApiResponse } from 'next'
import { env } from '@/env/server.mjs'
import { prisma } from '../../server/db/client'

const LOCALES = ['en', 'pl', 'es', 'de', 'pt', 'fr', 'ko', 'ar', 'tr', 'ja', 'it']

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const [users, articles] = await Promise.all([
        prisma.user.findMany({
            select: { username: true },
        }),
        prisma.article.findMany({
            where: { isPublished: true },
            select: { slug: true, updatedAt: true },
            orderBy: { publishedAt: 'desc' },
        }),
    ])

    res.statusCode = 200
    res.setHeader('Content-Type', 'text/xml')
    res.setHeader('Cache-control', 'stale-while-revalidate, s-maxage=3600')

    const baseUrl = env.NEXTAUTH_URL

    const userUrls = users
        .map(({ username }) => `<url><loc>${baseUrl}/${username}</loc></url>`)
        .join('')

    const articleUrls = articles
        .map(({ slug, updatedAt }) => {
            const hreflangs = LOCALES.map((locale) => {
                const prefix = locale === 'en' ? '' : `/${locale}`
                return `<xhtml:link rel="alternate" hreflang="${locale}" href="${baseUrl}${prefix}/blog/${slug}"/>`
            }).join('')

            const xDefault = `<xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/blog/${slug}"/>`
            const lastmod = updatedAt ? `<lastmod>${updatedAt.toISOString()}</lastmod>` : ''

            return `<url><loc>${baseUrl}/blog/${slug}</loc>${lastmod}${hreflangs}${xDefault}</url>`
        })
        .join('')

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xhtml="http://www.w3.org/1999/xhtml">
        ${userUrls}
        ${articleUrls}
        </urlset>
    `

    res.end(xml)
}
```

- [ ] **Step 2: Verify sitemap generates valid XML**

Run: `npm run dev`. Visit `http://localhost:3000/api/sitemap` — should return valid XML with user URLs (articles section will be empty until articles are published). Kill dev server.

- [ ] **Step 3: Commit**

```bash
git add src/pages/api/sitemap.ts
git commit -m "feat(blog): update sitemap with article URLs and hreflang alternates"
```

---

## Task 10: Content Pipeline — Orchestrator Command

**Files:**
- Create: `.claude/commands/content.md`

- [ ] **Step 1: Create content batch orchestrator**

This is the `/content N` slash command. It follows the digital-nomad pattern adapted for Juicify's fitness/nutrition domain.

The command should:
1. Read strategy from this plan and the spec
2. Query DB for existing articles (check for thin content < 8000 chars)
3. Pick N keywords using niche diversity rotation across the 10 fitness/nutrition niches
4. Spawn N parallel pipeline agents
5. Each pipeline: web research (PubMed + health sources) → EN writer → image search → 10 translators → validate → insert
6. Report results

Create at `.claude/commands/content.md`. Model the file after `/Users/kamilowczarek/Documents/GitHub/digital-nomad/.claude/commands/content.md` but adapted for:
- Juicify's Neon project ID (query this from the environment or use `mcp__Neon__list_projects` to find it)
- Fitness/nutrition niches instead of city niches
- PubMed/health source research instead of city DB queries
- No city-article mapping (simpler — just Article table)
- `references` JSON field for citations

**The full content.md file should include:**
- Step 1: Read current state (query existing articles)
- Step 1b: Check for thin articles needing regeneration
- Step 2: Pick keywords (keyword analyst logic with niche taxonomy)
- Step 3: Spawn N pipeline agents with detailed prompt including:
  - Pipeline Step 1: Web research (PubMed, WHO, Mayo Clinic, etc.)
  - Pipeline Step 2: Write EN article (HTML, 2000-2500 words, min 8000 chars, 3-5 citations, 4-6 FAQs)
  - Pipeline Step 3: Pick and verify Unsplash image
  - Pipeline Step 4: Translate to 10 languages (parallel)
  - Pipeline Step 5: Validate (hard/soft fail rules)
  - Pipeline Step 6: Calculate reading time + Insert via SQL
  - Pipeline Step 7: Report
- Step 4: Report summary

- [ ] **Step 2: Commit**

```bash
git add .claude/commands/content.md
git commit -m "feat(blog): add /content N orchestrator command for automated article generation"
```

---

## Task 11: Content Pipeline — Writer Agent

**Files:**
- Create: `.claude/agents/juicify-content-writer.md`

- [ ] **Step 1: Create content writer agent**

Model after `/Users/kamilowczarek/Documents/GitHub/digital-nomad/.claude/agents/nomad-content-writer.md` but adapted for fitness/nutrition domain.

The agent should define:
- Brand voice: evidence-based, encouraging, practical
- Article templates for each niche type
- Output fields (titleEn, excerptEn, contentEn, metaTitleEn, metaDescEn, FAQ pairs)
- Citation format: `<a href="[pubmed/source-url]">[Author et al., Year]</a>`
- Quality checklist (every claim cited, min 3 citations, min 8000 chars, 4+ FAQs, internal links)
- Medical disclaimer requirement: "This article is for informational purposes only. Consult a healthcare professional before making dietary changes."

Create at `.claude/agents/juicify-content-writer.md`.

- [ ] **Step 2: Commit**

```bash
git add .claude/agents/juicify-content-writer.md
git commit -m "feat(blog): add content writer agent for fitness/nutrition articles"
```

---

## Task 12: Content Pipeline — Keyword Analyst Agent

**Files:**
- Create: `.claude/agents/juicify-keyword-analyst.md`

- [ ] **Step 1: Create keyword analyst agent**

This agent is responsible for dynamically picking the best keywords for the next batch of articles. It should define:

- The 10 fitness/nutrition niches from the taxonomy (section 2 of the spec)
- Niche diversity rotation logic: never pick the same niche twice in one batch (if N <= 8), prefer niches with 0 existing articles
- Niche rotation order: `nutrition-science` → `diet-guide` → `weight-management` → `exercise-science` → `food-myths` → `supplement-review` → `meal-planning` → `body-composition` → `fitness-for-beginners` → `sport-nutrition`
- Content overlap detection: compare candidate keywords against existing article titles, reject 80%+ semantic overlap
- Keyword format for each niche type (e.g., "how [nutrient] affects [body function]" for nutrition-science)
- Output: N briefs with `{ niche, keyword, suggestedSlug, mode: "new"|"regenerate" }`
- Input: existing article slugs + titles from DB, N requested

Create at `.claude/agents/juicify-keyword-analyst.md`.

- [ ] **Step 2: Commit**

```bash
git add .claude/agents/juicify-keyword-analyst.md
git commit -m "feat(blog): add keyword analyst agent for niche-diverse topic selection"
```

---

## Task 13: Build Verification

- [ ] **Step 1: Run lint**

Run: `npm run lint`
Expected: No errors (warnings OK).

- [ ] **Step 2: Run production build**

Run: `npm run build`
Expected: Build succeeds. Blog pages compile. No type errors.

- [ ] **Step 3: Fix any issues found**

If lint or build fails, fix the issues and commit fixes.

- [ ] **Step 4: Final commit (if fixes needed)**

```bash
git add -A
git commit -m "fix(blog): resolve build issues"
```
