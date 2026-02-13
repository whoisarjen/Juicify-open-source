# Juicify

Open-source calorie counter and personal trainer that combines nutrition tracking with AI-powered dietary coaching. No ads, no premium tiers — just a tool that works.

**[Live](https://juicify.whoisarjen.com)**

<p align="center">
  <a href="https://juicify.whoisarjen.com">
    <img src=".github/preview.png" alt="Juicify preview" width="720" />
  </a>
</p>

## Features

- **Calorie & macro tracking** — Log meals with barcode scanning or manual search
- **Personalized workout plans** — Create and track custom training routines
- **Live dietary coaching** — AI analyzes your body's response to food and adjusts calorie targets in real time
- **Workout logging** — Track sets, reps, and progress over time
- **Offline support** — Works without an internet connection
- **Privacy-first** — No background syncing, your data stays on your device

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js, React, TypeScript, MUI, Tailwind CSS |
| API | tRPC, Zod |
| Data Fetching | TanStack React Query |
| Auth | NextAuth with Prisma adapter |
| Database | Prisma ORM, PostgreSQL (Neon serverless) |
| Deployment | Vercel |

## Getting Started

**Prerequisites:** Node.js 18+, a [Neon](https://neon.tech) PostgreSQL database

```bash
git clone https://github.com/whoisarjen/Juicify-open-source.git
cd Juicify-open-source
npm install
npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> The `dev` script pulls environment variables from Vercel. Set up a `.env` file manually if you're not using Vercel.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Contributing

Contributions welcome — open an issue or submit a pull request.

## License

MIT — see [LICENSE](LICENSE).

## Author

Built by [Kamil Owczarek](https://github.com/whoisarjen).
