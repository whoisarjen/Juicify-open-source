# Juicify

Free, ad-free calorie counter and personal trainer app with AI coaching, offline support, and workout planning.

## Tech Stack

- **Framework:** Next.js 13 (Pages Router) + TypeScript
- **UI:** React 18, Material-UI 5, Tailwind CSS 3
- **API:** tRPC 10 (end-to-end type safety)
- **Database:** PostgreSQL via Neon serverless + Prisma 5 ORM
- **Auth:** NextAuth 4 (Google OAuth)
- **Forms:** React Hook Form + Zod validation
- **State:** TanStack React Query 4
- **i18n:** next-translate (en, pl)
- **PWA:** next-pwa for offline support

## Commands

```bash
npm run dev        # Start dev server (port 3000, pulls Vercel env)
npm run build      # Production build (generates Prisma client first)
npm start          # Start production server
npm run lint       # ESLint
npm run generate   # Regenerate Prisma client
```

## Project Structure

```
src/
├── pages/              # Next.js file-based routing + API routes
│   ├── api/trpc/       # tRPC HTTP handler
│   ├── api/auth/       # NextAuth endpoints
│   └── [login]/        # Dynamic user profile routes
├── server/
│   ├── db/client.ts    # Prisma client (Neon adapter)
│   ├── trpc/           # tRPC setup + routers
│   │   └── router/     # Domain routers (user, product, consumed, exercise, etc.)
│   ├── schema/         # Zod validation schemas
│   └── common/         # Shared server utils
├── components/         # Reusable UI components
├── containers/         # Feature-specific container components
├── hooks/              # Custom React hooks (useDaily, useConsumed, useBurned)
├── utils/              # Utility functions
├── layout/             # Layout components (Header, Sidebar, Footer)
├── env/                # Env variable validation (Zod)
└── types/              # TypeScript type definitions
prisma/
└── schema.prisma       # Database schema
locales/                # i18n translations (en/, pl/)
```

## Path Aliases

- `@/components/*` → `src/components/*`
- `@/containers/*` → `src/containers/*`
- `@/hooks/*` → `src/hooks/*`
- `@/utils/*` → `src/utils/*`
- `@/server/*` → `src/server/*`
- `@/env/*` → `src/env/*`
- `@/transition/*` → `src/transition/*`

## Key Patterns

- **tRPC routers** use `publicProcedure` and `protectedProcedure` with Zod input validation
- **SuperJSON** serializer for complex types (dates, etc.)
- **Container/Component split:** `containers/` hold business logic, `components/` are reusable UI
- **Per-day macronutrient targets:** User model stores separate daily targets (proteinsDay0-6, carbsDay0-6, etc.)
- **WorkoutPlan/WorkoutResult** store exercise data as JSON fields
- **Environment validation** via Zod schemas in `src/env/schema.mjs`

## Code Style

- Prettier: 4-space tabs, no semicolons, single quotes, trailing commas (ES5)
- Tailwind CSS class sorting enabled
- ESLint: extends `next/core-web-vitals`, allows explicit `any`
- `reactStrictMode: false` (for react-beautiful-dnd compatibility)

## Database

- PostgreSQL hosted on Neon (serverless, `@neondatabase/serverless` + `@prisma/adapter-neon`)
- Key models: User, Product, Consumed, Exercise, WorkoutPlan, WorkoutResult, Measurement, Coach, BurnedCalories, Post
- Enums: `kindOfDiets` (REGULAR, KETOGENIC), `activityLevels`, `goals` (weight change per week)

## Important Notes

- No test framework is configured
- Deployment target: Vercel
- Image domains: localhost, juicify.whoisarjen.com
- Dark mode supported (Tailwind class-based)
