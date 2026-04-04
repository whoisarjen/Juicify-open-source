/**
 * GET /api/user-snapshot?userId=<int>
 *
 * Returns a comprehensive 60-day snapshot of ALL user data for AI consumption.
 * Designed as the single source of truth for any AI agent that needs to reason
 * about a user's health, nutrition, training, sleep, and body composition.
 *
 * Authentication: token query param must match CRON_SECRET env variable.
 *   ?token=<CRON_SECRET>
 *
 * Query params:
 *   token  (required) — must match CRON_SECRET env variable
 *   userId (required) — integer user ID
 *   days   (optional) — number of days to look back, default 60, max 365
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ IMPORTANT: When adding a new Prisma model that stores user data,      │
 * │ you MUST add it to this endpoint. This is the AI's window into the    │
 * │ user — if data isn't here, the AI can't see it.                       │
 * │ See CLAUDE.md for the checklist.                                      │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Response shape (see bottom of file for full TypeScript type):
 * {
 *   snapshot: {
 *     generatedAt:    ISO timestamp
 *     periodStart:    ISO date (60 days ago)
 *     periodEnd:      ISO date (today)
 *     daysRequested:  number
 *
 *     user:           full profile (macros, goals, diet, activity, body stats)
 *     consumed:       food log entries with product macros expanded
 *     workoutResults: completed workout sessions with exercise details
 *     workoutPlans:   workout templates (active, not soft-deleted)
 *     exercises:      user's custom exercises (active, not soft-deleted)
 *     measurements:   body composition & vital sign readings
 *     burnedCalories: manual calorie burn entries
 *     supplements:    supplement stack with ingredients and schedules
 *     coach:          AI coaching history (macro recommendations, weight trend)
 *
 *     // Withings wearable data (only present if user has connected device)
 *     withingsActivity: daily step/calorie/HR summaries
 *     withingsWorkouts: device-recorded workout sessions
 *     withingsSleep:    nightly sleep stage & quality data
 *   }
 * }
 *
 * Data included per section:
 *
 * ── user ──────────────────────────────────────────────────────────
 *   Profile basics (name, email, locale, birth, height, sex)
 *   Per-day-of-week macro targets (proteins/carbs/fats for Mon–Sun)
 *   Fiber & sugar percentage targets
 *   Goal (weight change rate), diet type, activity level
 *   Coach scheduling (nextCoach, isCoachAnalyze)
 *   Account creation date (for tenure context)
 *
 * ── consumed ──────────────────────────────────────────────────────
 *   Every food log entry within the period
 *   Product macros expanded inline (proteins, carbs, sugar, fats, fiber, sodium, ethanol)
 *   Meal slot (0-4) and quantity (howMany)
 *   Timestamp (whenAdded) for time-of-day analysis
 *
 * ── workoutResults ────────────────────────────────────────────────
 *   Every completed workout within the period
 *   Full exercise JSON (sets, reps, weights per exercise)
 *   Duration (whenAdded → finishedAt)
 *   Burned calories (actual)
 *   Link to workout plan template (if started from one)
 *
 * ── workoutPlans ─────────────────────────────────────────────────
 *   All active (non-deleted) workout templates
 *   Exercise structure, estimated calories, descriptions
 *   Useful for understanding the user's training program design
 *
 * ── exercises ────────────────────────────────────────────────────
 *   User's custom exercise definitions (non-deleted)
 *   These are referenced inside workoutPlan/workoutResult exercise JSON
 *
 * ── measurements ──────────────────────────────────────────────────
 *   Body weight, fat ratio, muscle mass, bone mass, water mass
 *   Vital signs: heart pulse, blood pressure, temperature, SpO2, VO2max
 *   Body measurements: waist, hips
 *   Source field distinguishes manual vs Withings-synced entries
 *
 * ── burnedCalories ────────────────────────────────────────────────
 *   Manual calorie burn logs (name, calories, source)
 *   Distinct from workout burns — these are standalone activity entries
 *
 * ── supplements ───────────────────────────────────────────────────
 *   Full supplement stack (active AND inactive for history)
 *   Ingredients JSON (name, dose per ingredient)
 *   Schedule: timeOfDay (morning/afternoon/evening), frequency (every N days)
 *   isActive flag shows current vs discontinued supplements
 *
 * ── coach ─────────────────────────────────────────────────────────
 *   AI coaching analysis history within the period
 *   Calculated macros (countedProteins/Carbs/Fats/Calories)
 *   Weight tracking (currentWeight, changeInWeight)
 *   Goal, diet type, activity level at time of analysis
 *   Raw data payload (JSON) with detailed breakdown
 *
 * ── withingsActivity ──────────────────────────────────────────────
 *   Daily summaries from Withings wearable
 *   Steps, distance, active/total calories, elevation
 *   Activity durations by intensity (soft/moderate/intense)
 *   Heart rate stats (average, min, max) and HR zone durations
 *
 * ── withingsWorkouts ──────────────────────────────────────────────
 *   Individual workouts recorded by Withings device
 *   Category, duration (start→end), calories, intensity
 *   Steps, distance, elevation, HR stats, HR zones
 *   Swimming data (pool laps, length, strokes) when applicable
 *   SpO2 average, pause duration
 *
 * ── withingsSleep ─────────────────────────────────────────────────
 *   Nightly sleep data from Withings device
 *   Sleep stages: light, deep, REM, wakeup durations
 *   Sleep quality: score, efficiency, latency, WASO
 *   Time metrics: total sleep time, time in bed, duration to fall asleep
 *   Vital signs during sleep: HR (avg/min/max), RR (avg/min/max)
 *   Disturbances: breathing intensity, snoring count, out-of-bed count
 */

import type { NextApiRequest, NextApiResponse } from 'next'
import { env } from '@/env/server.mjs'
import { prisma } from '@/server/db/client'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    // ── Auth: require token query param matching CRON_SECRET ─────────
    if (!env.CRON_SECRET) {
        return res.status(501).json({ error: 'Cron not configured' })
    }

    const token = req.query.token
    if (!token || token !== env.CRON_SECRET) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    // ── Parse & validate query params ──────────────────────────────
    const userIdRaw = req.query.userId
    if (!userIdRaw || Array.isArray(userIdRaw)) {
        return res.status(400).json({ error: 'userId query param required (integer)' })
    }

    const userId = parseInt(userIdRaw, 10)
    if (isNaN(userId)) {
        return res.status(400).json({ error: 'userId must be an integer' })
    }

    const daysRaw = req.query.days
    let days = 60
    if (daysRaw && !Array.isArray(daysRaw)) {
        const parsed = parseInt(daysRaw, 10)
        if (!isNaN(parsed) && parsed > 0) {
            days = Math.min(parsed, 365)
        }
    }

    // ── Date range: from N days ago (start of day UTC) to now ──────
    const now = new Date()
    const periodStart = new Date(now)
    periodStart.setDate(periodStart.getDate() - days)
    periodStart.setHours(0, 0, 0, 0)

    // ── Verify user exists ─────────────────────────────────────────
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            createdAt: true,
            username: true,
            name: true,
            surname: true,
            email: true,
            locale: true,
            numberOfMeals: true,
            // Per-day-of-week macro targets (0=Sunday, 6=Saturday)
            proteinsDay0: true, carbsDay0: true, fatsDay0: true,
            proteinsDay1: true, carbsDay1: true, fatsDay1: true,
            proteinsDay2: true, carbsDay2: true, fatsDay2: true,
            proteinsDay3: true, carbsDay3: true, fatsDay3: true,
            proteinsDay4: true, carbsDay4: true, fatsDay4: true,
            proteinsDay5: true, carbsDay5: true, fatsDay5: true,
            proteinsDay6: true, carbsDay6: true, fatsDay6: true,
            fiber: true,
            carbsPercentAsSugar: true,
            height: true,
            birth: true,
            sex: true,
            goal: true,
            kindOfDiet: true,
            activityLevel: true,
            isSportActive: true,
            nextCoach: true,
            isCoachAnalyze: true,
            description: true,
        },
    })

    if (!user) {
        return res.status(404).json({ error: 'User not found' })
    }

    // ── Fetch all user data in parallel ────────────────────────────
    // Each query scoped to userId + date range where applicable.
    // Order: chronological (oldest first) so AI can reason about trends.
    const [
        consumed,
        workoutResults,
        workoutPlans,
        exercises,
        measurements,
        burnedCalories,
        supplements,
        coach,
        withingsActivity,
        withingsWorkouts,
        withingsSleep,
    ] = await Promise.all([
        // ── Food log with product macros ───────────────────────────
        prisma.consumed.findMany({
            where: {
                userId,
                whenAdded: { gte: periodStart, lte: now },
            },
            select: {
                id: true,
                whenAdded: true,
                howMany: true,
                meal: true,
                product: {
                    select: {
                        id: true,
                        name: true,
                        proteins: true,
                        carbs: true,
                        sugar: true,
                        fats: true,
                        fiber: true,
                        sodium: true,
                        ethanol: true,
                        barcode: true,
                    },
                },
            },
            orderBy: { whenAdded: 'asc' },
        }),

        // ── Workout results with exercise details ──────────────────
        prisma.workoutResult.findMany({
            where: {
                userId,
                whenAdded: { gte: periodStart, lte: now },
            },
            select: {
                id: true,
                name: true,
                note: true,
                burnedCalories: true,
                exercises: true,
                whenAdded: true,
                finishedAt: true,
                workoutPlanId: true,
            },
            orderBy: { whenAdded: 'asc' },
        }),

        // ── Workout plan templates (all active, not date-bound) ────
        prisma.workoutPlan.findMany({
            where: {
                userId,
                isDeleted: false,
            },
            select: {
                id: true,
                name: true,
                description: true,
                burnedCalories: true,
                exercises: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'asc' },
        }),

        // ── Custom exercises (all active, not date-bound) ──────────
        prisma.exercise.findMany({
            where: {
                userId,
                isDeleted: false,
            },
            select: {
                id: true,
                name: true,
                createdAt: true,
            },
            orderBy: { name: 'asc' },
        }),

        // ── Body measurements ──────────────────────────────────────
        prisma.measurement.findMany({
            where: {
                userId,
                whenAdded: { gte: periodStart, lte: now },
            },
            select: {
                id: true,
                whenAdded: true,
                weight: true,
                fatRatio: true,
                fatMass: true,
                muscleMass: true,
                boneMass: true,
                waterMass: true,
                fatFreeMass: true,
                heartPulse: true,
                diastolicBp: true,
                systolicBp: true,
                temperature: true,
                bodyTemperature: true,
                skinTemperature: true,
                spo2: true,
                pulseWaveVelocity: true,
                vo2Max: true,
                waist: true,
                hips: true,
                source: true,
            },
            orderBy: { whenAdded: 'asc' },
        }),

        // ── Manual burned calories ─────────────────────────────────
        prisma.burnedCalories.findMany({
            where: {
                userId,
                whenAdded: { gte: periodStart, lte: now },
            },
            select: {
                id: true,
                whenAdded: true,
                name: true,
                burnedCalories: true,
                source: true,
            },
            orderBy: { whenAdded: 'asc' },
        }),

        // ── Supplement stack (all, not date-bound — AI needs full context) ──
        prisma.supplement.findMany({
            where: { userId },
            select: {
                id: true,
                name: true,
                ingredients: true,
                timeOfDay: true,
                frequency: true,
                isActive: true,
                createdAt: true,
            },
            orderBy: { name: 'asc' },
        }),

        // ── Coach analysis history ─────────────────────────────────
        prisma.coach.findMany({
            where: {
                userId,
                createdAt: { gte: periodStart, lte: now },
            },
            select: {
                id: true,
                createdAt: true,
                goal: true,
                kindOfDiet: true,
                activityLevel: true,
                isSportActive: true,
                countedProteins: true,
                countedCarbs: true,
                countedFats: true,
                countedCalories: true,
                currentWeight: true,
                changeInWeight: true,
                isDataInJuicify: true,
                data: true,
            },
            orderBy: { createdAt: 'asc' },
        }),

        // ── Withings daily activity ────────────────────────────────
        prisma.withingsActivity.findMany({
            where: {
                userId,
                date: { gte: periodStart, lte: now },
            },
            select: {
                id: true,
                date: true,
                steps: true,
                distance: true,
                activeCalories: true,
                totalCalories: true,
                elevation: true,
                softDuration: true,
                moderateDuration: true,
                intenseDuration: true,
                hrAverage: true,
                hrMin: true,
                hrMax: true,
                hrZone0: true,
                hrZone1: true,
                hrZone2: true,
                hrZone3: true,
            },
            orderBy: { date: 'asc' },
        }),

        // ── Withings workouts ──────────────────────────────────────
        prisma.withingsWorkout.findMany({
            where: {
                userId,
                startDate: { gte: periodStart, lte: now },
            },
            select: {
                id: true,
                category: true,
                categoryName: true,
                startDate: true,
                endDate: true,
                calories: true,
                intensity: true,
                steps: true,
                distance: true,
                elevation: true,
                hrAverage: true,
                hrMin: true,
                hrMax: true,
                hrZone0: true,
                hrZone1: true,
                hrZone2: true,
                hrZone3: true,
                pauseDuration: true,
                spo2Average: true,
                poolLaps: true,
                poolLength: true,
                strokes: true,
            },
            orderBy: { startDate: 'asc' },
        }),

        // ── Withings sleep ─────────────────────────────────────────
        prisma.withingsSleep.findMany({
            where: {
                userId,
                date: { gte: periodStart, lte: now },
            },
            select: {
                id: true,
                date: true,
                startDate: true,
                endDate: true,
                lightSleepDuration: true,
                deepSleepDuration: true,
                remSleepDuration: true,
                wakeupDuration: true,
                wakeupCount: true,
                durationToSleep: true,
                durationToWakeup: true,
                hrAverage: true,
                hrMin: true,
                hrMax: true,
                rrAverage: true,
                rrMin: true,
                rrMax: true,
                breathingDisturbancesIntensity: true,
                snoring: true,
                snoringEpisodeCount: true,
                sleepScore: true,
                totalSleepTime: true,
                totalTimeInBed: true,
                sleepEfficiency: true,
                sleepLatency: true,
                waso: true,
                outOfBedCount: true,
                nbRemEpisodes: true,
            },
            orderBy: { date: 'asc' },
        }),
    ])

    // ── Build response ─────────────────────────────────────────────
    return res.status(200).json({
        snapshot: {
            generatedAt: now.toISOString(),
            periodStart: periodStart.toISOString(),
            periodEnd: now.toISOString(),
            daysRequested: days,

            user,
            consumed,
            workoutResults,
            workoutPlans,
            exercises,
            measurements,
            burnedCalories,
            supplements,
            coach,
            withingsActivity,
            withingsWorkouts,
            withingsSleep,
        },
    })
}
