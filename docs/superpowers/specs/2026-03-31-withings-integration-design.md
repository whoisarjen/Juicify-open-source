# Withings Integration Design

## Context

Juicify tracks weight via the `Measurement` model and calories burned via `BurnedCalories`. Users currently enter this data manually. Withings smart scales and trackers can provide weight, body composition, and activity data automatically. This integration syncs that data daily via a Vercel Cron job at midnight.

Initial scope: single account (Kamil's). Multi-user ready via the Account table pattern.

## Architecture

### Three flows

1. **One-time OAuth setup**: `GET /api/withings/authorize` → Withings consent → callback exchanges code for tokens → stored in `Account` table (provider: `"withings"`)
2. **Midnight cron sync**: Vercel Cron hits `GET /api/withings/sync` → refresh expired token → fetch yesterday's body measurements + activity → upsert into DB
3. **Token refresh**: Withings access tokens expire in 3h. Every sync call refreshes first. Refresh tokens are **single-use** — the new refresh_token must be stored atomically each time.

### Withings API endpoints used

| Endpoint | URL | Data |
|---|---|---|
| Measure - Getmeas | `POST https://wbsapi.withings.net/measure` | Weight, fat %, fat mass, muscle mass, bone mass, water mass |
| Measure v2 - Getactivity | `POST https://wbsapi.withings.net/v2/measure` | Steps, active calories, total calories, distance |
| OAuth2 - Token | `POST https://wbsapi.withings.net/v2/oauth2` | Token exchange and refresh |

### Data mapping

| Withings meastype | Code | Juicify field | Model |
|---|---|---|---|
| Weight | 1 | `weight` | Measurement |
| Fat Ratio (%) | 6 | `fatRatio` | Measurement (new) |
| Fat Mass (kg) | 8 | `fatMass` | Measurement (new) |
| Muscle Mass (kg) | 76 | `muscleMass` | Measurement (new) |
| Bone Mass (kg) | 88 | `boneMass` | Measurement (new) |
| Water Mass (kg) | 77 | `waterMass` | Measurement (new) |
| Active calories | — | `burnedCalories` | BurnedCalories |

Withings values are encoded as `value * 10^unit` (e.g., `value: 7230, unit: -2` = 72.30 kg).

## Schema changes

### Measurement model — add body composition fields

All new fields are nullable (manual entries unaffected):

```prisma
model Measurement {
  // ... existing fields ...
  fatRatio    Decimal? @db.Decimal(4, 1)  // body fat %
  fatMass     Decimal? @db.Decimal(4, 1)  // fat mass kg
  muscleMass  Decimal? @db.Decimal(4, 1)  // muscle mass kg
  boneMass    Decimal? @db.Decimal(3, 1)  // bone mass kg (2-4 kg range)
  waterMass   Decimal? @db.Decimal(4, 1)  // water mass kg
  source      String?  @db.VarChar(20)    // null = manual, "withings" = synced
}
```

### BurnedCalories model — add source tracking

```prisma
model BurnedCalories {
  // ... existing fields ...
  source      String?  @db.VarChar(20)    // null = manual, "withings" = synced
}
```

## Environment variables

All optional (integration disabled when absent):

- `WITHINGS_CLIENT_ID` — from developer.withings.com
- `WITHINGS_CLIENT_SECRET` — from developer.withings.com
- `CRON_SECRET` — protects the sync endpoint (Vercel sends as Bearer token)

## File structure

### New files

```
src/server/withings/client.ts     — Withings API client (token refresh, getmeas, getactivity)
src/server/withings/sync.ts       — Sync orchestration (fetch + DB upsert)
src/pages/api/withings/authorize.ts — Redirect to Withings OAuth consent
src/pages/api/withings/sync.ts    — Cron endpoint (protected by CRON_SECRET)
```

### Modified files

```
prisma/schema.prisma              — Add body comp fields + source columns
src/env/schema.mjs                — Add optional WITHINGS_* and CRON_SECRET
src/pages/api/withings/callback.ts — Replace stub with token exchange logic
vercel.json                       — Add crons config
```

### No changes needed

- tRPC routers — Prisma returns new columns automatically
- Zod input schemas — new fields are server-write-only
- Frontend components — new fields are nullable, existing displays unaffected

## Key implementation details

### Token refresh (single-use refresh tokens)

```
getValidAccessToken(userId):
  1. Find Account where provider="withings" AND userId
  2. If expires_at < now: call Withings token endpoint with grant_type=refresh_token
  3. Store NEW access_token, refresh_token, and expires_at atomically
  4. Return access_token
```

### Idempotent sync (upsert pattern)

Since there's no unique constraint on `(userId, whenAdded, source)`, use findFirst + create/update:

```
For each data type:
  1. findFirst where userId + source="withings" + whenAdded in yesterday's range
  2. If found: update values
  3. If not found: create new record
```

### Vercel Cron config

```json
{
  "crons": [{
    "path": "/api/withings/sync",
    "schedule": "0 0 * * *"
  }]
}
```

Vercel sends `GET` with `Authorization: Bearer {CRON_SECRET}` header automatically.

## Verification

1. Set env vars in Vercel (WITHINGS_CLIENT_ID, WITHINGS_CLIENT_SECRET, CRON_SECRET)
2. Deploy, visit `/api/withings/authorize`, complete Withings OAuth
3. Check DB: Account row with provider="withings" should exist with tokens
4. Manually call `/api/withings/sync` with Bearer token header
5. Check DB: Measurement and BurnedCalories entries with source="withings" for yesterday
