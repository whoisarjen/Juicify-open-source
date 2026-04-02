# Content Batch — Create $ARGUMENTS articles

You are the content batch orchestrator for **Juicify** (juicify.whoisarjen.com) — a fitness, nutrition, and wellness blog.

The user wants **$ARGUMENTS** articles created. If no number is given, default to **5**.

## Your Job

Execute the full pipeline: analyze → research → write → translate → validate → insert. Each article is independent — insert as soon as it's ready, don't wait for others.

## Step 1: Read Current State

First, find the Juicify Neon project ID:
```
Use mcp__Neon__list_projects to find the Juicify project. Store the projectId for all subsequent SQL calls.
```

Query the DB for existing articles (this is the single source of truth — no log files):
```sql
SELECT slug, "titleEn", niche, "publishedAt" FROM "Article" ORDER BY "publishedAt" DESC;
```

## Step 1b: Check for Short Articles Needing Regeneration

Before picking new keywords, check for existing articles with thin content:

```sql
SELECT slug, "titleEn", niche, "readingTimeMinutes",
       LENGTH("contentEn") AS content_length_chars,
       "publishedAt", "updatedAt"
FROM "Article"
WHERE LENGTH("contentEn") < 8000
ORDER BY LENGTH("contentEn") ASC
LIMIT 10;
```

**Threshold:** Any article with `contentEn` under 8000 characters is considered thin and should be regenerated. New articles target 2000-2500 words in HTML (~9000-15000 chars), so 8000 chars catches articles clearly below the quality bar.

**If thin articles found:**
- Regenerate them first, consuming slots from the N requested — but **cap regeneration at 50% of N** (rounded down). So `/content 5` → max 2 regenerations + min 3 new. If more thin articles exist, they'll be caught on the next batch.
- Example: 5 requested, 4 thin found → regenerate 2, create 3 new
- Use the same pipeline agent prompt (Step 3) but with mode: **regenerate** — the agent receives the existing slug and must:
  1. Do fresh web research (PubMed, WHO, Mayo Clinic)
  2. Write a full new article (2000-2500 words EN, minimum 8,000 characters)
  3. Translate to all 10 languages
  4. **UPDATE** (not INSERT) the existing row:
     ```sql
     UPDATE "Article"
     SET "titleEn" = '...', "contentEn" = '...', ...,
         "updatedAt" = NOW(),
         "publishedAt" = NOW(),
         "readingTimeMinutes" = [calculated value],
         niche = '[niche]',
         references = '[json array]'::jsonb,
         "featuredImageUrl" = '[new verified URL]',
         "featuredImageAlt" = '...',
         "featuredImageOwnerName" = '...',
         "featuredImageOwnerUsername" = '...'
     WHERE slug = '[existing-slug]';
     ```
  5. Keep the same slug — do NOT insert new rows
- If more thin articles exist than requested slots → pick the shortest ones first
- If no thin articles → skip this step entirely, proceed normally

## Step 2: Pick Keywords (Keyword Analyst)

### Content Overlap Detection

Before finalizing keywords, check for **semantic overlap** with existing articles. Two articles should not cover the same topic under different slugs.

For each candidate keyword:
1. Compare against existing article titles — if an existing title covers 80%+ of the same topic, skip it
2. Examples of overlap to reject:
   - "how to count calories" vs "calorie counting guide for beginners" — same topic, skip
   - "best protein sources" vs "top protein-rich foods" — same topic, skip
3. Examples that are OK:
   - "protein for muscle building" vs "protein for weight loss" — different angle, OK
   - "meal planning for beginners" vs "meal planning for athletes" — different audience, OK

### Niche/Category Taxonomy

Every article belongs to exactly one **niche**. Use this list — pick the most specific match:

| Niche ID | Description | Example keywords |
|----------|-------------|-----------------|
| `nutrition-science` | Evidence-based nutrition principles, macronutrients, micronutrients | "how protein synthesis works muscle growth" |
| `diet-guide` | Specific diet plans explained (keto, Mediterranean, intermittent fasting) | "Mediterranean diet complete guide benefits" |
| `weight-management` | Calorie deficit, weight loss, weight gain, body recomposition | "calorie deficit explained how to lose weight safely" |
| `exercise-science` | Training principles, progressive overload, recovery, workout types | "progressive overload guide strength training" |
| `food-myths` | Debunking nutrition misconceptions with evidence | "does eating at night cause weight gain myth" |
| `supplement-review` | Evidence-based supplement analysis (creatine, whey, vitamins) | "creatine benefits side effects evidence review" |
| `meal-planning` | Practical meal prep, macro tracking, recipe strategies | "meal prep for muscle gain weekly plan" |
| `body-composition` | Body fat, muscle mass, DEXA, measurements, BMI alternatives | "body fat percentage how to measure accurately" |
| `fitness-for-beginners` | Foundational guides for people starting their fitness journey | "complete beginner workout plan first gym visit" |
| `sport-nutrition` | Nutrition for athletic performance, pre/post workout, hydration | "pre workout nutrition what to eat before training" |

### Pick N keywords using this logic:

1. **Check what niches are already covered** — infer niche from existing article slugs/titles and the `niche` column in DB. Build a list of saturated niches (>= 3 articles).
2. **For all slots, maximize niche diversity in this batch:**
   - Never pick the same niche twice in one batch if N <= 10.
   - Prefer niches with 0 existing articles > niches with 1-2 articles > niches with 3+ articles.
   - Aim for at least 3 different niches per batch (or all different if N <= 5).
3. **Niche rotation order** (rotate, skipping already-used in this batch):
   - `nutrition-science` → `diet-guide` → `weight-management` → `exercise-science` → `food-myths` → `supplement-review` → `meal-planning` → `body-composition` → `fitness-for-beginners` → `sport-nutrition`
4. For each niche, craft a long-tail keyword targeting a specific, searchable question or topic within that niche.
5. **Never duplicate** — check existing article slugs in DB AND run content overlap detection above.

## Step 3: Spawn N Pipeline Agents (All in Parallel, Background)

For each keyword, spawn one `general-purpose` agent as a background pipeline. **Launch ALL of them in a single message** so they run in parallel.

Each pipeline agent receives this prompt (fill in the specifics):

```
You are a content pipeline for Juicify (juicify.whoisarjen.com) — a fitness & nutrition blog. Create ONE complete article and insert it into the database.

## Your Article
- Niche: [niche-id from taxonomy]
- Keyword: "[the keyword]"
- Suggested slug: "[slug]"
- Mode: [new / regenerate]
- If regenerate: existing slug to UPDATE = "[slug]"

## Pipeline Step 1: Web Research (MANDATORY)

Use WebSearch to find evidence-based sources for the article topic. This is critical — every health claim must be backed by a cited source.

Run 3-5 searches like:
- "PubMed [topic] systematic review"
- "[topic] WHO guidelines"
- "[topic] Mayo Clinic"
- "[topic] Harvard Health"
- "[topic] examine.com"
- "[topic] meta-analysis 2024 2025"

**Minimum requirement: Find at least 3 credible sources.** Prefer:
1. PubMed studies (systematic reviews, meta-analyses, RCTs)
2. WHO / CDC / NHS guidelines
3. Mayo Clinic, Harvard Health, Cleveland Clinic
4. examine.com (evidence-based supplement/nutrition analysis)
5. Peer-reviewed journals (JAMA, BMJ, Lancet, AJCN)

For each source, record:
- title: the study/article title
- url: direct URL to the source
- source: publisher name (e.g., "PubMed", "WHO", "Mayo Clinic")

These become the `references` JSON field: `[{"title": "...", "url": "...", "source": "..."}, ...]`

Do NOT proceed without at least 3 verified citations. If you cannot find 3, try broader search terms.

## Pipeline Step 2: Write English Article

Use the research to write a **2000-2500 word** article. Every health claim MUST cite a source from Pipeline Step 1.

**MEDICAL DISCLAIMER (REQUIRED):** Every article must include this disclaimer, placed after the introduction and before the first H2 section:
```html
<p><em>This article is for informational purposes only. Consult a healthcare professional before making dietary or exercise changes.</em></p>
```

**YEAR FRESHNESS:** Include the current year naturally in the opening paragraph and at least one H2 heading (e.g., "What Science Says About Protein Intake in 2026"). Google rewards freshness signals.

**CRITICAL LENGTH REQUIREMENT:** The final `contentEn` HTML must be at least **8,000 characters** (not words — characters including HTML tags). Articles under 8000 chars are flagged as "thin" and will be regenerated, wasting the entire pipeline run. Aim for 10,000-15,000 chars to have comfortable margin.

**CITATION FORMAT:** When citing sources in-text, use this pattern:
```html
<p>Research shows that creatine supplementation can increase lean mass by 1-2 kg over 4-12 weeks
(<a href="https://pubmed.ncbi.nlm.nih.gov/XXXXX/" target="_blank" rel="noopener">Cooper et al., 2012</a>).</p>
```

**INTERNAL LINKS (important for SEO):**
- Link to related blog articles: `<a href="/blog/[article-slug]">[article title]</a>` — 2-3 per article where natural
- Query existing articles for internal linking:
  ```sql
  SELECT slug, "titleEn" FROM "Article" WHERE "isPublished" = true LIMIT 20;
  ```
- Place links naturally within flowing text — never in a "Related Articles" list section
- Keep anchor text descriptive and varied (not "click here" or bare URLs)
- Translated versions must preserve the same `href` URLs (slugs are language-independent), only the anchor text gets translated

**How to hit 8,000+ chars reliably:**
- Write 7-10 H2/H3 sections (not 3-4 short ones)
- Each section should be 2-4 substantial paragraphs (not 1-2 sentences)
- Include data tables where appropriate (nutrient comparisons, study results, meal plan examples)
- Add a "What the Research Says" or "Scientific Evidence" section summarizing key studies
- Write detailed FAQ answers (3-5 sentences each, citing specific data — not one-liners)
- Include practical application sections (how to actually implement the advice)

**Self-check (MANDATORY before proceeding to Pipeline Step 3):** After writing contentEn, use Bash to count characters:
```bash
echo -n 'YOUR_CONTENT_HERE' | wc -c
```
If under 8,000 → STOP, expand the weakest sections, and re-count. Do NOT proceed to the next step with thin content.

Output these English fields:
- titleEn (under 70 chars)
- excerptEn (1-2 sentences with key data point)
- contentEn (full HTML, **2000-2500 words, minimum 8,000 characters** — verified via self-check above)
- metaTitleEn (under 60 chars)
- metaDescEn (120-155 chars, include key number or finding)
- FAQ pairs: 4-6 pairs — **both `questionEn` and `answerEn` must be non-empty strings for every pair** (never null, never empty string). Omit a pair entirely rather than including one with a missing answer. **Each answer must be at least 150 characters** (3-5 sentences with specific data points). One-liner FAQ answers don't earn Google rich snippets — substantial answers do.

## Pipeline Step 3: Pick Featured Image

Search for a relevant Unsplash photo. **Each article MUST have a unique image** — never reuse the same photo ID as an existing article.

### Step 3a: Check existing images to avoid duplicates

```sql
SELECT "featuredImageUrl" FROM "Article" WHERE "isPublished" = true;
```

Store this list — your chosen image URL must NOT match any existing one.

### Step 3b: Search for a unique photo

Use WebSearch (NOT WebFetch — Unsplash blocks scraping) with specific queries:

```
WebSearch: site:unsplash.com/photos [specific-topic-keyword]
```

Try 2-3 different search queries with specific keywords related to the article topic. Examples:
- For a keto article: `site:unsplash.com/photos avocado eggs bacon`
- For a running article: `site:unsplash.com/photos trail running outdoors`
- For a supplement article: `site:unsplash.com/photos supplement capsules vitamins`

### Step 3c: Extract photo details

From the search results, find an Unsplash photo page URL like `unsplash.com/photos/DESCRIPTION-PHOTO_ID`.

1. **Extract the photo ID** — the last path segment (e.g., `abc123XYZ` from `/photos/healthy-meal-abc123XYZ`, or just `abc123XYZ` from `/photos/abc123XYZ`)
2. **Fetch the photo page** to get attribution:
   ```
   WebFetch: https://unsplash.com/photos/[PHOTO_ID]
   ```
   Extract the photographer's name and username from the page.
3. **Construct the image URL:** `https://images.unsplash.com/photo-[PHOTO_ID]?w=1200&h=630&fit=crop`
4. **Verify the URL works** using WebFetch on the constructed URL. If it 404s, try the next search result.

### Step 3d: Niche fallback images (only if search fails after 3 attempts)

If you cannot find a unique image, use the fallback for the article's niche. **Never use the same fallback twice** — if the niche fallback is already used by another article, try the next niche's fallback.

| Niche | Fallback Photo ID | Attribution |
|-------|------------------|-------------|
| `nutrition-science` | `photo-1490645935967-10de6ba17061` | Brooke Lark (brookelark) |
| `diet-guide` | `photo-1512621776951-a57141f2eefd` | Anna Pelzer (annapelzer) |
| `weight-management` | `photo-1465056836643-15cea6cfe14e` | Jenny Hill (jennyhill) |
| `exercise-science` | `photo-1534438327276-14e5300c3a48` | Danielle Cerullo (dncerullo) |
| `food-myths` | `photo-1546069901-ba9599a7e63c` | Ella Olsson (ellaolsson) |
| `supplement-review` | `photo-1558618666-fcd25c85cd64` | Michele Blackwell (micheleblackwell) |
| `meal-planning` | `photo-1498837167922-ddd27525d352` | Dan Gold (dangold) |
| `body-composition` | `photo-1571019614242-c5c5dee9f50b` | Alora Griffiths (aloragriffiths) |
| `fitness-for-beginners` | `photo-1517836357463-d25dfeac3438` | John Arano (johnarano) |
| `sport-nutrition` | `photo-1504674900247-0877df9cc836` | Lily Banse (lilybanse) |

URL format: `https://images.unsplash.com/[PHOTO_ID]?w=1200&h=630&fit=crop`

## Pipeline Step 4: Translate to 10 Languages (Parallel)

Spawn 10 translation agents in parallel (one per language: PL, ES, DE, PT, FR, KO, AR, TR, JA, IT).

Each translator receives the EN title, excerpt, content, metaTitle, metaDesc, and FAQ pairs.

Translation rules:
- Scientific terms, brand names, and units stay in original form (e.g., "creatine", "BMI", "kcal")
- Nutrient names can be translated if a standard local term exists
- **Internal link `href` attributes stay identical** — only translate the anchor text between `<a>` and `</a>` tags
- **Medical disclaimer must be translated** — the disclaimer text gets translated to each language
- Meta title under 60 chars in target language
- Meta description 120-155 chars in target language
- Natural translation, not word-for-word
- Preserve all citation links exactly as-is (only translate surrounding text)

**Translation quality check:** Each translator must verify their output meets these minimums:
- content[Lang] character length ratio vs contentEn:
  - **Latin-script languages** (PL, ES, DE, PT, FR, IT, TR): at least **60%** of contentEn length
  - **CJK + Arabic** (KO, JA, AR): at least **40%** of contentEn length (these scripts are denser — the same content uses far fewer characters)
- All FAQ answers are translated (no empty strings)
- HTML structure is preserved (same number of `<h2>`, `<table>`, `<a>` tags)

If a translation fails the quality check, the translator should retry once. If it still fails, return what they have — a slightly short translation is better than blocking the pipeline.

Collect all 10 translations.

## Pipeline Step 5: Validate

Hard fails (do NOT insert):
- Check slug doesn't already exist (for new articles): `SELECT slug FROM "Article" WHERE slug = '[slug]'`
- titleEn and titlePl must be non-empty
- contentEn must be **2000+ words AND 8,000+ characters** (articles under 8000 chars get flagged for regeneration — hard-fail now to avoid wasting the pipeline). If too short, go back to Pipeline Step 2 and expand the article before continuing.
- featuredImageUrl must be non-empty
- featuredImageOwnerName must be a non-empty string (Unsplash license requires attribution)
- featuredImageAlt must be at least 20 characters and describe the actual image
- Every FAQ pair in `faqs` must have both a non-empty `question` and a non-empty `answer` — drop any pair missing either field
- Every FAQ `answer` must be at least **150 characters**
- Minimum 3 entries in `references` JSON array — each with non-empty `title`, `url`, and `source`
- Medical disclaimer must be present in contentEn

Soft warnings (insert anyway, note in report):
- Any meta title over 60 chars → truncate
- Any meta description over 155 chars → truncate
- Translation content under threshold (60% for Latin scripts, 40% for KO/JA/AR) → flag
- featuredImageOwnerUsername is null → flag
- Fewer than 5 references → flag

## Pipeline Step 6: Calculate Reading Time + Insert via SQL

### Calculate readingTimeMinutes

Before inserting, calculate the reading time from the English content word count:

```
readingTimeMinutes = ROUND(word_count_en / 230)
```

Use 230 words per minute (average reading speed for informational content). Minimum 1 minute. Count words by splitting contentEn (stripped of HTML tags) on whitespace.

### Insert

Use mcp__Neon__run_sql (with the projectId found in Step 1) to insert. Build the INSERT statement with ALL 11 languages + references:

```sql
INSERT INTO "Article" (
  slug, "isPublished", "publishedAt",
  "titleEn", "excerptEn", "contentEn", "metaTitleEn", "metaDescEn",
  "titlePl", "excerptPl", "contentPl", "metaTitlePl", "metaDescPl",
  "titleEs", "excerptEs", "contentEs", "metaTitleEs", "metaDescEs",
  "titleDe", "excerptDe", "contentDe", "metaTitleDe", "metaDescDe",
  "titlePt", "excerptPt", "contentPt", "metaTitlePt", "metaDescPt",
  "titleFr", "excerptFr", "contentFr", "metaTitleFr", "metaDescFr",
  "titleKo", "excerptKo", "contentKo", "metaTitleKo", "metaDescKo",
  "titleAr", "excerptAr", "contentAr", "metaTitleAr", "metaDescAr",
  "titleTr", "excerptTr", "contentTr", "metaTitleTr", "metaDescTr",
  "titleJa", "excerptJa", "contentJa", "metaTitleJa", "metaDescJa",
  "titleIt", "excerptIt", "contentIt", "metaTitleIt", "metaDescIt",
  faqs, "readingTimeMinutes", niche, references,
  "featuredImageUrl", "featuredImageAlt", "featuredImageOwnerName", "featuredImageOwnerUsername"
) VALUES (
  '[slug]', true, NOW(),
  '[titleEn]', '[excerptEn]', '[contentEn]', '[metaTitleEn]', '[metaDescEn]',
  '[titlePl]', '[excerptPl]', '[contentPl]', '[metaTitlePl]', '[metaDescPl]',
  '[titleEs]', '[excerptEs]', '[contentEs]', '[metaTitleEs]', '[metaDescEs]',
  '[titleDe]', '[excerptDe]', '[contentDe]', '[metaTitleDe]', '[metaDescDe]',
  '[titlePt]', '[excerptPt]', '[contentPt]', '[metaTitlePt]', '[metaDescPt]',
  '[titleFr]', '[excerptFr]', '[contentFr]', '[metaTitleFr]', '[metaDescFr]',
  '[titleKo]', '[excerptKo]', '[contentKo]', '[metaTitleKo]', '[metaDescKo]',
  '[titleAr]', '[excerptAr]', '[contentAr]', '[metaTitleAr]', '[metaDescAr]',
  '[titleTr]', '[excerptTr]', '[contentTr]', '[metaTitleTr]', '[metaDescTr]',
  '[titleJa]', '[excerptJa]', '[contentJa]', '[metaTitleJa]', '[metaDescJa]',
  '[titleIt]', '[excerptIt]', '[contentIt]', '[metaTitleIt]', '[metaDescIt]',
  '[faqs JSON]'::jsonb, [readingTimeMinutes], '[niche]', '[references JSON]'::jsonb,
  '[featuredImageUrl]', '[featuredImageAlt]', '[featuredImageOwnerName]', '[featuredImageOwnerUsername]'
);
```

-- featuredImageUrl: the curl-verified images.unsplash.com URL from Pipeline Step 3
-- featuredImageAlt: short description of what the image shows (e.g. "Colorful healthy meal with grilled chicken and vegetables")
-- featuredImageOwnerName: photographer's display name from Unsplash (REQUIRED — never empty)
-- featuredImageOwnerUsername: photographer's Unsplash username (use NULL only if truly unknown after web search)
-- references: JSON array of citations, e.g. [{"title":"...","url":"...","source":"PubMed"},...]

## Pipeline Step 7: Deep Post-Insert Verification (MANDATORY)

After inserting, immediately verify the article exists and is complete in the database. This is the most important step — an article that isn't queryable is worthless.

```sql
SELECT
  slug,
  "isPublished",
  LENGTH("contentEn") AS en_chars,
  LENGTH("contentPl") AS pl_chars,
  LENGTH("contentEs") AS es_chars,
  LENGTH("contentDe") AS de_chars,
  LENGTH("contentPt") AS pt_chars,
  LENGTH("contentFr") AS fr_chars,
  LENGTH("contentKo") AS ko_chars,
  LENGTH("contentAr") AS ar_chars,
  LENGTH("contentTr") AS tr_chars,
  LENGTH("contentJa") AS ja_chars,
  LENGTH("contentIt") AS it_chars,
  "titleEn" IS NOT NULL AND "titleEn" != '' AS has_title_en,
  "titlePl" IS NOT NULL AND "titlePl" != '' AS has_title_pl,
  "featuredImageUrl" IS NOT NULL AND "featuredImageUrl" != '' AS has_image,
  "featuredImageOwnerName" IS NOT NULL AND "featuredImageOwnerName" != '' AS has_attribution,
  jsonb_array_length(COALESCE(references, '[]'::jsonb)) AS ref_count,
  jsonb_array_length(COALESCE(faqs, '[]'::jsonb)) AS faq_count,
  "readingTimeMinutes",
  niche
FROM "Article"
WHERE slug = '[slug]';
```

**Verification checks:**
1. Row exists (`isPublished = true`)
2. `en_chars >= 8000` — if not, the insert was truncated or malformed. DELETE and retry.
3. All 11 language content columns are non-null and non-empty (`> 0` chars)
4. `ref_count >= 3` — citations are present
5. `faq_count >= 4` — FAQs are present
6. `has_image = true` and `has_attribution = true`
7. `readingTimeMinutes >= 1`
8. `niche` is set

**If any check fails:** Report which check failed. For critical failures (row missing, content truncated, 0 translations), attempt one retry — DELETE the row and re-insert. For minor failures (1-2 translations empty), flag in report but don't retry.

## Pipeline Step 8: Report

Return a summary:
- Status: published / verified / failed
- Slug
- Keyword
- **Niche** (from taxonomy)
- Word count (EN)
- EN chars (from DB verification)
- Reading time (calculated)
- Citations count (from DB verification)
- Translations: X/10 non-empty (from DB verification)
- DB verification: PASS / FAIL [details]
- Any warnings
```

## Step 4: Report Summary

After all N agents finish, present:

```
## Content Batch Complete

**Articles requested:** N
**Published:** X/N
**Regenerated (thin):** R
**Failed:** Y (with reasons)

| # | Slug | Niche | EN chars | Citations | Languages | DB Verified | Warnings |
|---|------|-------|----------|-----------|-----------|-------------|----------|
| 1 | how-protein-synthesis-works-... | nutrition-science | 12,340 | 5 | 11/11 | PASS | none |
| 2 | calorie-deficit-guide-... | weight-management | 9,870 | 4 | 10/11 | PASS | KO empty |
| 3 | creatine-evidence-review-... | supplement-review | 11,200 | 6 | 11/11 | PASS | fallback image |
| ...

**Next trigger will analyze fresh and pick the next best keywords.**
```

## Content Rules (Non-Negotiable)

1. **Every health claim must be backed by a cited source** — no unsourced claims about nutrition or exercise
2. **Never give medical advice** — always include "consult a healthcare professional" disclaimer
3. **All 11 languages per insert**, single DB call
4. **Each pipeline independent** — first done = first inserted
5. **Failed translations don't block** (missing lang gets empty string)
6. **Minimum 3 verified citations per article** (PubMed preferred)
7. **HTML format, not Markdown** — all content fields use HTML
8. **Unsplash images via WebSearch** — never guess photo IDs
9. **FAQ answers minimum 150 characters**, citing specific data
10. **Reading time calculated:** ROUND(words / 230), minimum 1
11. **Deep DB verification after every insert** — query the row back and confirm all fields are present and meet minimums. No article is "done" until verified in DB.
