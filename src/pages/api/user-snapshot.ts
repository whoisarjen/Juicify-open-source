/**
 * GET /api/user-snapshot?token=<apiToken>
 *
 * Returns a comprehensive snapshot of ALL user data for AI consumption.
 * Designed as the single source of truth for any AI agent that needs to reason
 * about a user's health, nutrition, training, sleep, and body composition.
 *
 * Authentication: user's apiToken query param
 *   ?token=<user's apiToken>
 *
 * Query params:
 *   token  (required) — user's apiToken (auto-generated, visible in settings)
 *   days   (optional) — number of days to look back, default 30, max 90
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ IMPORTANT: When adding a new Prisma model that stores user data,      │
 * │ you MUST add it to this endpoint. This is the AI's window into the    │
 * │ user — if data isn't here, the AI can't see it.                       │
 * │ See CLAUDE.md for the checklist.                                      │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Response shape:
 * {
 *   snapshot: {
 *     generatedAt:    ISO timestamp
 *     periodStart:    ISO date (N days ago)
 *     periodEnd:      ISO date (today)
 *     daysRequested:  number
 *
 *     _guide:         AI-readable instructions for interpreting each field
 *     user:           full profile (macros, goals, diet, activity, body stats)
 *
 *     // Reference data (not date-bound)
 *     workoutPlans:   workout templates (active, not soft-deleted)
 *     exercises:      user's custom exercises (active, not soft-deleted)
 *     supplements:    supplement stack with ingredients and schedules
 *
 *     // All time-series data grouped by date
 *     dailyLog: {
 *       "YYYY-MM-DD": {
 *         consumed?:         food log grouped by meal slot
 *         workoutResults?:   completed workouts
 *         measurements?:     body composition & vitals
 *         burnedCalories?:   manual calorie burns
 *         coach?:            AI coaching snapshots
 *         withingsActivity?: wearable daily summary
 *         withingsWorkouts?: wearable workout sessions
 *         withingsSleep?:    wearable sleep data
 *       }
 *     }
 *   }
 * }
 *
 * Data included per section:
 *
 * ── user ──────────────────────────────────────────────────────────
 *   Profile basics (name, email, locale, birth, height, sex)
 *   Per-day-of-week macro targets (proteins/carbs/fats for Mon–Sun)
 *   Per-day-of-week minimum macro targets (minProteins/minCarbs/minFats)
 *   Fiber & sugar percentage targets
 *   Goal (weight change rate), diet type, activity level
 *   Coach scheduling (nextCoach, isCoachAnalyze)
 *   Account creation date (for tenure context)
 *
 * ── consumed ──────────────────────────────────────────────────────
 *   Aggregated by date (YYYY-MM-DD) → meal slot (0-4)
 *   Each day shows mealCount and meals object keyed by meal number
 *   Each meal entry has product macros (proteins, carbs, sugar, fats, fiber, sodium, ethanol)
 *   and quantity (howMany)
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
 *   Morning Pulse: pulseSleep, pulseFatigue, pulseMood, pulseSoreness, pulseStress, pulseErection (1-5 scales)
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
import { prisma } from '@/server/db/client'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    // ── Auth: user apiToken ──────────────────────────────────────────
    const token = req.query.token
    if (!token || Array.isArray(token)) {
        return res.status(401).json({ error: 'token query param required' })
    }

    const tokenUser = await prisma.user.findUnique({
        where: { apiToken: token },
        select: { id: true },
    })
    if (!tokenUser) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    const userId = tokenUser.id
    let days = 30
    const daysRaw = req.query.days
    if (daysRaw && !Array.isArray(daysRaw)) {
        const parsed = parseInt(daysRaw, 10)
        if (!isNaN(parsed) && parsed > 0) {
            days = Math.min(parsed, 90)
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
            // Per-day-of-week minimum macro targets
            minProteinsDay0: true, minCarbsDay0: true, minFatsDay0: true,
            minProteinsDay1: true, minCarbsDay1: true, minFatsDay1: true,
            minProteinsDay2: true, minCarbsDay2: true, minFatsDay2: true,
            minProteinsDay3: true, minCarbsDay3: true, minFatsDay3: true,
            minProteinsDay4: true, minCarbsDay4: true, minFatsDay4: true,
            minProteinsDay5: true, minCarbsDay5: true, minFatsDay5: true,
            minProteinsDay6: true, minCarbsDay6: true, minFatsDay6: true,
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
                pulseSleep: true,
                pulseFatigue: true,
                pulseMood: true,
                pulseSoreness: true,
                pulseStress: true,
                pulseErection: true,
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

    // ── Group ALL time-series data by date (YYYY-MM-DD) ──────────────
    // This lets the AI see everything that happened on a given day in one place.
    type DailyEntry = {
        consumed?: { mealCount: number; meals: Record<number, typeof consumed> }
        workoutResults?: typeof workoutResults
        measurements?: typeof measurements
        burnedCalories?: typeof burnedCalories
        coach?: typeof coach
        withingsActivity?: typeof withingsActivity
        withingsWorkouts?: typeof withingsWorkouts
        withingsSleep?: typeof withingsSleep
    }

    const dailyLog: Record<string, DailyEntry> = {}

    const ensureDay = (date: string): DailyEntry => {
        if (!dailyLog[date]) dailyLog[date] = {}
        return dailyLog[date]
    }

    // Consumed → grouped by day → meal slot
    for (const entry of consumed) {
        const date = entry.whenAdded.toISOString().slice(0, 10)
        const day = ensureDay(date)
        if (!day.consumed) day.consumed = { mealCount: 0, meals: {} }
        if (!day.consumed.meals[entry.meal]) {
            day.consumed.meals[entry.meal] = []
            day.consumed.mealCount++
        }
        day.consumed.meals[entry.meal].push(entry)
    }

    // Workout results → by whenAdded date
    for (const entry of workoutResults) {
        const date = entry.whenAdded.toISOString().slice(0, 10)
        const day = ensureDay(date)
        if (!day.workoutResults) day.workoutResults = []
        day.workoutResults.push(entry)
    }

    // Measurements → by whenAdded date
    for (const entry of measurements) {
        const date = entry.whenAdded.toISOString().slice(0, 10)
        const day = ensureDay(date)
        if (!day.measurements) day.measurements = []
        day.measurements.push(entry)
    }

    // Burned calories → by whenAdded date
    for (const entry of burnedCalories) {
        const date = entry.whenAdded.toISOString().slice(0, 10)
        const day = ensureDay(date)
        if (!day.burnedCalories) day.burnedCalories = []
        day.burnedCalories.push(entry)
    }

    // Coach → by createdAt date
    for (const entry of coach) {
        const date = entry.createdAt.toISOString().slice(0, 10)
        const day = ensureDay(date)
        if (!day.coach) day.coach = []
        day.coach.push(entry)
    }

    // Withings activity → by date
    for (const entry of withingsActivity) {
        const date = entry.date.toISOString().slice(0, 10)
        const day = ensureDay(date)
        if (!day.withingsActivity) day.withingsActivity = []
        day.withingsActivity.push(entry)
    }

    // Withings workouts → by startDate
    for (const entry of withingsWorkouts) {
        const date = entry.startDate.toISOString().slice(0, 10)
        const day = ensureDay(date)
        if (!day.withingsWorkouts) day.withingsWorkouts = []
        day.withingsWorkouts.push(entry)
    }

    // Withings sleep → by date
    for (const entry of withingsSleep) {
        const date = entry.date.toISOString().slice(0, 10)
        const day = ensureDay(date)
        if (!day.withingsSleep) day.withingsSleep = []
        day.withingsSleep.push(entry)
    }

    // Sort dailyLog keys chronologically
    const sortedDailyLog: Record<string, DailyEntry> = {}
    for (const date of Object.keys(dailyLog).sort()) {
        sortedDailyLog[date] = dailyLog[date]
    }

    // ── Build response ─────────────────────────────────────────────
    return res.status(200).json({
        snapshot: {
            generatedAt: now.toISOString(),
            periodStart: periodStart.toISOString(),
            periodEnd: now.toISOString(),
            daysRequested: days,

            _guide: {
                overview: 'This snapshot contains ALL user data grouped by date. Use dailyLog to see everything that happened on a given day. Reference data (workoutPlans, exercises, supplements) is separate because it is not date-bound.',
                dailyLog: {
                    structure: 'Object keyed by date (YYYY-MM-DD) in chronological order. Each day contains only the sections that have data — missing keys mean no data for that day/section.',
                    consumed: {
                        description: 'Food log grouped by meal slot number (0-based, up to numberOfMeals-1 from user profile).',
                        macroCalculation: 'Product macros (proteins, carbs, fats, etc.) are per 100g. Multiply each macro by (howMany / 100) to get the actual intake for that entry. Sum across all entries in a day for daily totals.',
                        example: 'If product.proteins=25 and howMany=200, actual protein intake = 25 * (200/100) = 50g.',
                    },
                    workoutResults: {
                        description: 'Completed workout sessions. Duration = finishedAt - whenAdded. The exercises field is a JSON array of exercise objects.',
                        exerciseFormat: 'Each exercise in the JSON has a name and sets array. Each set has reps and weight (kg). To calculate volume: sum(reps * weight) across all sets.',
                        burnedCalories: 'Actual calories burned during this workout session.',
                        workoutPlanId: 'References a template in workoutPlans — null if the workout was ad-hoc.',
                    },
                    measurements: {
                        description: 'Body composition and vital sign readings.',
                        units: 'weight: kg, fatRatio: %, temperature/bodyTemperature/skinTemperature: °C, heartPulse: bpm, blood pressure: mmHg, spo2: %, vo2Max: mL/kg/min, waist/hips: cm.',
                        morningPulse: 'pulseSleep/pulseFatigue/pulseMood/pulseSoreness/pulseStress/pulseErection are 1-5 subjective scales (1=worst, 5=best). These are self-reported morning wellness indicators.',
                        source: '"manual" = user-entered, "withings" = synced from Withings device.',
                    },
                    burnedCalories: {
                        description: 'Standalone manual calorie burn entries (walking, cycling, etc.). Separate from workout burnedCalories.',
                    },
                    coach: {
                        description: 'AI coaching analysis snapshots. Shows calculated macro targets and weight at that point in time.',
                        countedFields: 'countedProteins/Carbs/Fats/Calories are the recommended daily targets the coach calculated.',
                        changeInWeight: 'Weight change (kg) since previous coach analysis. Positive = gained, negative = lost.',
                    },
                    withingsActivity: {
                        description: 'Daily wearable summary. Durations are in seconds.',
                        calorieTypes: 'activeCalories = movement only, totalCalories = activeCalories + BMR.',
                        hrZones: 'hrZone0-3 are durations (seconds) in each heart rate zone (0=rest, 1=light, 2=moderate, 3=intense).',
                    },
                    withingsWorkouts: {
                        description: 'Individual workout sessions recorded by Withings device. Duration = endDate - startDate minus pauseDuration.',
                    },
                    withingsSleep: {
                        description: 'Nightly sleep data. All durations are in seconds.',
                        sleepScore: 'Overall sleep quality score 0-100.',
                        sleepEfficiency: 'Percentage of time in bed actually spent sleeping.',
                        waso: 'Wake After Sleep Onset — total seconds awake after initially falling asleep.',
                        rrFields: 'Respiratory rate (breaths per minute) during sleep.',
                    },
                },
                user: {
                    macroTargets: 'proteinsDay0-6 / carbsDay0-6 / fatsDay0-6 are daily macro targets in grams. Day numbers: 0=Sunday, 1=Monday, ..., 6=Saturday. Use the day-of-week from the date to pick the correct targets.',
                    minMacroTargets: 'minProteinsDay0-6 etc. are minimum thresholds — the user should eat at least this much.',
                    fiber: 'Daily fiber target in grams.',
                    carbsPercentAsSugar: 'Maximum percentage of daily carbs that should come from sugar.',
                    goal: 'Weight change goal per week (e.g., -0.5 = lose 0.5 kg/week, 0 = maintain, 0.5 = gain).',
                    numberOfMeals: 'How many meal slots the user uses per day (determines meal numbers in consumed data).',
                },
                referenceData: {
                    workoutPlans: 'Workout templates — not date-bound. Referenced by workoutPlanId in workoutResults.',
                    exercises: 'Custom exercise definitions — referenced by name inside workout JSON.',
                    supplements: 'Full supplement stack. isActive=true means currently taking. timeOfDay and frequency show the schedule.',
                },
                tips: [
                    'To check adherence: compare daily consumed totals against the user macro targets for that day-of-week.',
                    'To spot trends: iterate dailyLog dates chronologically and track weight, calories, or training volume over time.',
                    'Days with no key in dailyLog had no tracked data — this itself is a signal (missed tracking).',
                    'Cross-reference withingsActivity calories with consumed calories to estimate energy balance.',
                    'Morning pulse ratings dropping over time may indicate overtraining or poor recovery.',
                ],
            },

            user,

            // Reference data (not date-bound)
            workoutPlans,
            exercises,
            supplements,

            // All time-series data grouped by date
            dailyLog: sortedDailyLog,
        },
    })
}
