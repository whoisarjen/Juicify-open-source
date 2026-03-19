# Juicify Blog System Design

**Created:** 2026-03-19
**Status:** Approved

## Overview

Add a full blog system to Juicify (juicify.app) following the proven pattern from nomad.whoisarjen.com. The blog serves SEO-optimized, science-backed fitness and nutrition articles in 11 languages, generated via an automated AI content pipeline that cites PubMed and other reputable health sources.

## Key Decisions

- **Architecture:** Column-per-language on a single Article model (same as digital-nomad)
- **Languages:** Blog supports 11 (en, pl, es, de, pt, fr, ko, ar, tr, ja, it). App stays en+pl.
- **Content source:** PubMed preferred + WHO, NHS, Mayo Clinic, Harvard Health, examine.com. 3-5 references per article.
- **Pipeline:** Fully automated `/content N` command — no human review before publish.
- **Database:** Same Neon PostgreSQL, Article model added to existing Prisma schema.
- **Frontend:** MUI + Tailwind, same pattern as digital-nomad (hero, card grid, pagination, FAQ accordion, schema.org markup). Uses frontend-design skill for implementation.

---

## 1. Database Schema

Article model added to `prisma/schema.prisma` (already applied):

```prisma
model Article {
  slug        String   @id
  isPublished Boolean  @default(false)
  publishedAt DateTime @default(now())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @default(now()) @updatedAt

  // Per-language fields (5 fields x 11 languages = 55 columns)
  // Pattern: title[Lang], excerpt[Lang], content[Lang], metaTitle[Lang], metaDesc[Lang]
  // Languages: En (required), Pl, Es, De, Pt, Fr, Ko, Ar, Tr, Ja, It

  // Shared fields
  featuredImageUrl          String?
  featuredImageAlt          String?
  featuredImageOwnerName    String?
  featuredImageOwnerUsername String?
  readingTimeMinutes        Int      @default(1)
  faqs                      Json?    // [{questionEn, answerEn, questionPl, answerPl, ...}]
  niche                     String?  // taxonomy category
  references                Json?    // [{title, url, source}] — scientific citations

  @@index([isPublished, publishedAt])
}
```

Key differences from digital-nomad:
- No city relationship (articles are educational, not location-bound)
- `niche` field for article taxonomy
- `references` field for scientific citations (PubMed DOIs, WHO links, etc.)

---

## 2. Article Niche Taxonomy

| Niche ID | Description |
|----------|-------------|
| `nutrition-science` | How nutrients work in the body |
| `diet-guide` | Specific diet breakdowns |
| `weight-management` | Fat loss / muscle gain science |
| `exercise-science` | Training principles backed by research |
| `food-myths` | Debunking common nutrition myths |
| `supplement-review` | Evidence-based supplement analysis |
| `meal-planning` | Practical meal prep and macro strategies |
| `body-composition` | Body recomp, measurements, tracking |
| `fitness-for-beginners` | Entry-level guides |
| `sport-nutrition` | Nutrition for specific sports/activities |

---

## 3. API Layer (tRPC)

New router: `src/server/trpc/router/article.ts`

| Procedure | Type | Input | Description |
|-----------|------|-------|-------------|
| `article.list` | public | `{ page, limit, niche?, search?, locale }` | Paginated article list |
| `article.getBySlug` | public | `{ slug, locale }` | Single article with content |
| `article.sitemap` | public | none | All published slugs for sitemap |

**Locale-resolved response** — backend selects the right language column and falls back to English. Frontend always reads the same normalized fields:

```typescript
{
  slug: string
  title: string           // title[Locale] || titleEn
  excerpt: string         // excerpt[Locale] || excerptEn
  content: string         // content[Locale] || contentEn
  metaTitle: string | null
  metaDesc: string | null
  featuredImageUrl: string | null
  featuredImageAlt: string | null
  featuredImageOwnerName: string | null
  featuredImageOwnerUsername: string | null
  readingTimeMinutes: number
  publishedAt: Date
  niche: string | null
  references: Array<{ title: string, url: string, source: string }>
  faqs: Array<{ question: string, answer: string }>  // locale-resolved
}
```

---

## 4. Blog Pages (Frontend)

### `/blog` — Article listing
- Hero section with featured article (latest published, large image)
- Grid of remaining articles (responsive 1/2/3 columns)
- Each card: featured image, niche tag, title, excerpt, reading time, date
- Pagination (numbered buttons)
- Loading skeletons

### `/blog/[slug]` — Article detail
- Hero image with Unsplash attribution
- Breadcrumb: Home > Blog > Article Title
- Meta: publication date + reading time + niche tag
- Article content (HTML rendered)
- References section (linked citations)
- FAQ section (collapsible accordion, FAQPage schema.org markup)
- Related articles section (2-3 from same niche)
- Back to blog link

### SEO
- OG tags (title, description, image, type)
- Twitter card (summary_large_image)
- Schema.org: `Article` + `FAQPage` + `BreadcrumbList`
- Dynamic `<title>` and `<meta description>` from metaTitle/metaDesc

### Sitemap
- Update `/api/sitemap` to include blog article URLs
- Generate hreflang alternates for all 11 locales per article

---

## 5. i18n Changes

Blog-only expansion to 11 languages. App stays en+pl.

- Update `next.config.js` to list all 11 locales
- Update `i18n.json` — blog pages use all 11, other pages stay en+pl
- Create `locales/{lang}/blog.json` for all 11 languages (UI strings: pagination, "Back to blog", "Read more", niche names, etc.)
- Blog pages detect locale from Next.js router, pass to tRPC `locale` param
- Sitemap generates hreflang alternates for all 11 locales per article

---

## 6. Content Pipeline

### Trigger
`/content N` slash command (default: 5 articles)

### Pipeline flow (per article)
1. **Keyword Analyst** — queries existing articles, picks keywords using niche diversity rotation across the 10 fitness/nutrition niches
2. **Web Research** — WebSearch for PubMed studies + reputable health sources. Extract 3-5 citations with real URLs and verify they resolve.
3. **EN Writer** — writes 2000-2500 word HTML article with:
   - Scientific citations linked inline
   - Internal links to `/blog/[other-slug]`
   - Minimum 8,000 characters
   - 4-6 FAQ pairs (150+ chars each answer)
   - Current year in opening + at least one H2
4. **Image Search** — Unsplash via WebSearch/WebFetch, verify URL, extract attribution
5. **10 Translation Agents** — parallel, quality checks (60% Latin, 40% CJK/Arabic)
6. **Validate** — hard/soft fail rules (same as digital-nomad)
7. **Insert** — single SQL INSERT via Neon MCP

### Content rules
1. Every health claim must be backed by a cited source
2. Never give medical advice — always "consult a healthcare professional"
3. All 11 languages per insert, single DB call
4. Each pipeline independent — first done = first inserted
5. Failed translations don't block (missing lang gets empty string)
6. Minimum 3 verified citations per article (PubMed preferred)
7. HTML format, not Markdown
8. Unsplash images via WebSearch — never guess photo IDs
9. FAQ answers minimum 150 characters, citing specific data
10. Reading time calculated: `ROUND(words / 230)`

### Agent files to create
- `.claude/commands/content.md` — orchestrator command
- `.claude/agents/juicify-content-writer.md` — EN writer with fitness/nutrition voice
- `.claude/agents/juicify-keyword-analyst.md` — keyword picker with nutrition niches

### Brand voice
- **Tone:** Evidence-based, encouraging, practical. Like a knowledgeable trainer who reads research papers.
- **Perspective:** Second-person ("you") for advice
- **Style:** Clear explanations of science, practical takeaways, zero bro-science
- **Differentiator:** Every claim backed by real citations. Not "studies show..." but "[Author et al., 2024](link) found that..."
