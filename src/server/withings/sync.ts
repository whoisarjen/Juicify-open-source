import { prisma } from '../db/client'
import {
    getValidAccessToken,
    getMeasurements,
    getActivity,
    getSleep,
    getWorkouts,
    parseWithingsValue,
    MEASTYPE_MAP,
    WORKOUT_CATEGORY_MAP,
} from './client'
import type { WithingsSleepSummary } from './client'
import moment from 'moment'

export async function syncWithingsData(userId: number) {
    const accessToken = await getValidAccessToken(userId)

    const yesterday = moment().subtract(1, 'day')
    const startOfDay = yesterday.clone().startOf('day')
    const endOfDay = yesterday.clone().endOf('day')
    const dateYmd = yesterday.format('YYYY-MM-DD')

    await Promise.all([
        syncMeasurements(accessToken, userId, startOfDay, endOfDay),
        syncActivityData(accessToken, userId, startOfDay, dateYmd),
        syncSleepData(accessToken, userId, startOfDay, dateYmd),
        syncWorkouts(accessToken, userId, dateYmd),
    ])
}

export async function syncWithingsRange(userId: number, days: number) {
    const accessToken = await getValidAccessToken(userId)

    const startDate = moment().subtract(days, 'days').startOf('day')
    const endDate = moment().subtract(1, 'day').endOf('day')
    const startYmd = startDate.format('YYYY-MM-DD')
    const endYmd = endDate.format('YYYY-MM-DD')

    // Measurements need day-by-day (unix timestamp range per day)
    for (let i = days; i >= 1; i--) {
        const day = moment().subtract(i, 'day')
        await syncMeasurements(
            accessToken,
            userId,
            day.clone().startOf('day'),
            day.clone().endOf('day'),
        )
    }

    // Activity, sleep, workouts support date ranges — one call each
    await Promise.all([
        syncActivityRange(accessToken, userId, startYmd, endYmd),
        syncSleepRange(accessToken, userId, startYmd, endYmd),
        syncWorkoutRange(accessToken, userId, startYmd, endYmd),
    ])
}

async function syncMeasurements(
    accessToken: string,
    userId: number,
    startOfDay: moment.Moment,
    endOfDay: moment.Moment,
) {
    const groups = await getMeasurements(
        accessToken,
        startOfDay.unix(),
        endOfDay.unix(),
    )

    if (groups.length === 0) return

    // Merge all measurement groups from the day (different devices may report different types)
    const values: Record<string, number> = {}
    let latestDate = 0

    for (const group of groups) {
        if (group.date > latestDate) latestDate = group.date
        for (const measure of group.measures) {
            const field = MEASTYPE_MAP[measure.type]
            if (field) {
                values[field] = parseWithingsValue(measure.value, measure.unit)
            }
        }
    }

    if (Object.keys(values).length === 0) return

    const existing = await prisma.measurement.findFirst({
        where: {
            userId,
            source: 'withings',
            whenAdded: {
                gte: startOfDay.toDate(),
                lte: endOfDay.toDate(),
            },
        },
    })

    const toInt = (v: number | undefined) =>
        v !== undefined ? Math.round(v) : null

    const data = {
        weight: values.weight ?? 0,
        fatFreeMass: values.fatFreeMass ?? null,
        fatRatio: values.fatRatio ?? null,
        fatMass: values.fatMass ?? null,
        muscleMass: values.muscleMass ?? null,
        boneMass: values.boneMass ?? null,
        waterMass: values.waterMass ?? null,
        heartPulse: toInt(values.heartPulse),
        diastolicBp: toInt(values.diastolicBp),
        systolicBp: toInt(values.systolicBp),
        temperature: values.temperature ?? null,
        bodyTemperature: values.bodyTemperature ?? null,
        skinTemperature: values.skinTemperature ?? null,
        spo2: values.spo2 ?? null,
        pulseWaveVelocity: values.pulseWaveVelocity ?? null,
        vo2Max: values.vo2Max ?? null,
        source: 'withings' as const,
    }

    if (existing) {
        await prisma.measurement.update({
            where: { id_userId: { id: existing.id, userId } },
            data,
        })
    } else {
        await prisma.measurement.create({
            data: {
                ...data,
                userId,
                whenAdded: new Date(latestDate * 1000),
            },
        })
    }
}

async function syncActivityData(
    accessToken: string,
    userId: number,
    startOfDay: moment.Moment,
    dateYmd: string,
) {
    const activities = await getActivity(accessToken, dateYmd, dateYmd)

    if (activities.length === 0) return

    const activity = activities[0]!
    const date = startOfDay.toDate()

    await prisma.withingsActivity.upsert({
        where: { userId_date: { userId, date } },
        update: {
            steps: activity.steps || 0,
            distance: activity.distance || 0,
            activeCalories: activity.calories || 0,
            totalCalories: activity.totalcalories || 0,
            elevation: activity.elevation || 0,
            softDuration: activity.soft || 0,
            moderateDuration: activity.moderate || 0,
            intenseDuration: activity.intense || 0,
            hrAverage: activity.hr_average || null,
            hrMin: activity.hr_min || null,
            hrMax: activity.hr_max || null,
            hrZone0: activity.hr_zone_0 || 0,
            hrZone1: activity.hr_zone_1 || 0,
            hrZone2: activity.hr_zone_2 || 0,
            hrZone3: activity.hr_zone_3 || 0,
        },
        create: {
            userId,
            date,
            steps: activity.steps || 0,
            distance: activity.distance || 0,
            activeCalories: activity.calories || 0,
            totalCalories: activity.totalcalories || 0,
            elevation: activity.elevation || 0,
            softDuration: activity.soft || 0,
            moderateDuration: activity.moderate || 0,
            intenseDuration: activity.intense || 0,
            hrAverage: activity.hr_average || null,
            hrMin: activity.hr_min || null,
            hrMax: activity.hr_max || null,
            hrZone0: activity.hr_zone_0 || 0,
            hrZone1: activity.hr_zone_1 || 0,
            hrZone2: activity.hr_zone_2 || 0,
            hrZone3: activity.hr_zone_3 || 0,
        },
    })

    // Also create a BurnedCalories entry for the existing UI
    const activeCalories = Math.round(activity.calories || 0)
    if (activeCalories > 0) {
        const existingBurned = await prisma.burnedCalories.findFirst({
            where: {
                userId,
                source: 'withings',
                whenAdded: {
                    gte: startOfDay.toDate(),
                    lte: startOfDay.clone().endOf('day').toDate(),
                },
            },
        })

        if (existingBurned) {
            await prisma.burnedCalories.update({
                where: {
                    id_userId: { id: existingBurned.id, userId },
                },
                data: { burnedCalories: activeCalories },
            })
        } else {
            await prisma.burnedCalories.create({
                data: {
                    userId,
                    name: 'Withings Activity',
                    burnedCalories: activeCalories,
                    whenAdded: startOfDay.toDate(),
                    source: 'withings',
                },
            })
        }
    }
}

async function syncWorkouts(
    accessToken: string,
    userId: number,
    dateYmd: string,
) {
    const workouts = await getWorkouts(accessToken, dateYmd, dateYmd)

    for (const workout of workouts) {
        const startDate = new Date(workout.startdate * 1000)
        const d = workout.data

        await prisma.withingsWorkout.upsert({
            where: { userId_startDate: { userId, startDate } },
            update: {
                category: workout.category,
                categoryName:
                    WORKOUT_CATEGORY_MAP[workout.category] ?? 'Unknown',
                endDate: new Date(workout.enddate * 1000),
                calories: d.calories ?? 0,
                intensity: d.intensity ?? null,
                steps: d.steps ?? 0,
                distance: d.distance ?? 0,
                elevation: d.elevation ?? 0,
                hrAverage: d.hr_average ?? null,
                hrMin: d.hr_min ?? null,
                hrMax: d.hr_max ?? null,
                hrZone0: d.hr_zone_0 ?? 0,
                hrZone1: d.hr_zone_1 ?? 0,
                hrZone2: d.hr_zone_2 ?? 0,
                hrZone3: d.hr_zone_3 ?? 0,
                pauseDuration: d.pause_duration ?? 0,
                spo2Average: d.spo2_average ?? null,
                poolLaps: d.pool_laps ?? null,
                poolLength: d.pool_length ?? null,
                strokes: d.strokes ?? null,
            },
            create: {
                userId,
                category: workout.category,
                categoryName:
                    WORKOUT_CATEGORY_MAP[workout.category] ?? 'Unknown',
                startDate,
                endDate: new Date(workout.enddate * 1000),
                calories: d.calories ?? 0,
                intensity: d.intensity ?? null,
                steps: d.steps ?? 0,
                distance: d.distance ?? 0,
                elevation: d.elevation ?? 0,
                hrAverage: d.hr_average ?? null,
                hrMin: d.hr_min ?? null,
                hrMax: d.hr_max ?? null,
                hrZone0: d.hr_zone_0 ?? 0,
                hrZone1: d.hr_zone_1 ?? 0,
                hrZone2: d.hr_zone_2 ?? 0,
                hrZone3: d.hr_zone_3 ?? 0,
                pauseDuration: d.pause_duration ?? 0,
                spo2Average: d.spo2_average ?? null,
                poolLaps: d.pool_laps ?? null,
                poolLength: d.pool_length ?? null,
                strokes: d.strokes ?? null,
            },
        })
    }
}

async function syncSleepData(
    accessToken: string,
    userId: number,
    startOfDay: moment.Moment,
    dateYmd: string,
) {
    const sleepSummaries = await getSleep(accessToken, dateYmd, dateYmd)

    if (sleepSummaries.length === 0) return

    // Take the longest sleep session if multiple exist (naps vs main sleep)
    const sleep = sleepSummaries.reduce(
        (longest: WithingsSleepSummary, s: WithingsSleepSummary) =>
            (s.total_timeinbed || 0) > (longest.total_timeinbed || 0)
                ? s
                : longest,
    )

    const date = startOfDay.toDate()

    await prisma.withingsSleep.upsert({
        where: { userId_date: { userId, date } },
        update: {
            startDate: sleep.startdate
                ? new Date(sleep.startdate * 1000)
                : null,
            endDate: sleep.enddate
                ? new Date(sleep.enddate * 1000)
                : null,
            lightSleepDuration: sleep.lightsleepduration || 0,
            deepSleepDuration: sleep.deepsleepduration || 0,
            remSleepDuration: sleep.remsleepduration || 0,
            wakeupDuration: sleep.wakeupduration || 0,
            wakeupCount: sleep.wakeupcount || 0,
            durationToSleep: sleep.durationtosleep || 0,
            durationToWakeup: sleep.durationtowakeup || 0,
            hrAverage: sleep.hr_average || null,
            hrMin: sleep.hr_min || null,
            hrMax: sleep.hr_max || null,
            rrAverage: sleep.rr_average || null,
            rrMin: sleep.rr_min || null,
            rrMax: sleep.rr_max || null,
            breathingDisturbancesIntensity:
                sleep.breathing_disturbances_intensity || null,
            snoring: sleep.snoring || null,
            snoringEpisodeCount: sleep.snoringepisodecount || null,
            sleepScore: sleep.sleep_score || null,
            totalSleepTime: sleep.total_sleep_time || 0,
            totalTimeInBed: sleep.total_timeinbed || 0,
            sleepEfficiency: sleep.sleep_efficiency || null,
            sleepLatency: sleep.sleep_latency || null,
            waso: sleep.waso || null,
            outOfBedCount: sleep.out_of_bed_count || null,
            nbRemEpisodes: sleep.nb_rem_episodes || null,
        },
        create: {
            userId,
            date,
            startDate: sleep.startdate
                ? new Date(sleep.startdate * 1000)
                : null,
            endDate: sleep.enddate
                ? new Date(sleep.enddate * 1000)
                : null,
            lightSleepDuration: sleep.lightsleepduration || 0,
            deepSleepDuration: sleep.deepsleepduration || 0,
            remSleepDuration: sleep.remsleepduration || 0,
            wakeupDuration: sleep.wakeupduration || 0,
            wakeupCount: sleep.wakeupcount || 0,
            durationToSleep: sleep.durationtosleep || 0,
            durationToWakeup: sleep.durationtowakeup || 0,
            hrAverage: sleep.hr_average || null,
            hrMin: sleep.hr_min || null,
            hrMax: sleep.hr_max || null,
            rrAverage: sleep.rr_average || null,
            rrMin: sleep.rr_min || null,
            rrMax: sleep.rr_max || null,
            breathingDisturbancesIntensity:
                sleep.breathing_disturbances_intensity || null,
            snoring: sleep.snoring || null,
            snoringEpisodeCount: sleep.snoringepisodecount || null,
            sleepScore: sleep.sleep_score || null,
            totalSleepTime: sleep.total_sleep_time || 0,
            totalTimeInBed: sleep.total_timeinbed || 0,
            sleepEfficiency: sleep.sleep_efficiency || null,
            sleepLatency: sleep.sleep_latency || null,
            waso: sleep.waso || null,
            outOfBedCount: sleep.out_of_bed_count || null,
            nbRemEpisodes: sleep.nb_rem_episodes || null,
        },
    })
}

async function syncActivityRange(
    accessToken: string,
    userId: number,
    startYmd: string,
    endYmd: string,
) {
    const activities = await getActivity(accessToken, startYmd, endYmd)

    for (const activity of activities) {
        const date = moment(activity.date, 'YYYY-MM-DD').startOf('day').toDate()

        await prisma.withingsActivity.upsert({
            where: { userId_date: { userId, date } },
            update: {
                steps: activity.steps || 0,
                distance: activity.distance || 0,
                activeCalories: activity.calories || 0,
                totalCalories: activity.totalcalories || 0,
                elevation: activity.elevation || 0,
                softDuration: activity.soft || 0,
                moderateDuration: activity.moderate || 0,
                intenseDuration: activity.intense || 0,
                hrAverage: activity.hr_average || null,
                hrMin: activity.hr_min || null,
                hrMax: activity.hr_max || null,
                hrZone0: activity.hr_zone_0 || 0,
                hrZone1: activity.hr_zone_1 || 0,
                hrZone2: activity.hr_zone_2 || 0,
                hrZone3: activity.hr_zone_3 || 0,
            },
            create: {
                userId,
                date,
                steps: activity.steps || 0,
                distance: activity.distance || 0,
                activeCalories: activity.calories || 0,
                totalCalories: activity.totalcalories || 0,
                elevation: activity.elevation || 0,
                softDuration: activity.soft || 0,
                moderateDuration: activity.moderate || 0,
                intenseDuration: activity.intense || 0,
                hrAverage: activity.hr_average || null,
                hrMin: activity.hr_min || null,
                hrMax: activity.hr_max || null,
                hrZone0: activity.hr_zone_0 || 0,
                hrZone1: activity.hr_zone_1 || 0,
                hrZone2: activity.hr_zone_2 || 0,
                hrZone3: activity.hr_zone_3 || 0,
            },
        })

        const activeCalories = Math.round(activity.calories || 0)
        if (activeCalories > 0) {
            const startOfDay = moment(activity.date, 'YYYY-MM-DD').startOf('day')
            const existingBurned = await prisma.burnedCalories.findFirst({
                where: {
                    userId,
                    source: 'withings',
                    whenAdded: {
                        gte: startOfDay.toDate(),
                        lte: startOfDay.clone().endOf('day').toDate(),
                    },
                },
            })

            if (existingBurned) {
                await prisma.burnedCalories.update({
                    where: { id_userId: { id: existingBurned.id, userId } },
                    data: { burnedCalories: activeCalories },
                })
            } else {
                await prisma.burnedCalories.create({
                    data: {
                        userId,
                        name: 'Withings Activity',
                        burnedCalories: activeCalories,
                        whenAdded: startOfDay.toDate(),
                        source: 'withings',
                    },
                })
            }
        }
    }
}

async function syncSleepRange(
    accessToken: string,
    userId: number,
    startYmd: string,
    endYmd: string,
) {
    const sleepSummaries = await getSleep(accessToken, startYmd, endYmd)

    if (sleepSummaries.length === 0) return

    // Group by date, keep longest session per day
    const byDate = new Map<string, WithingsSleepSummary>()
    for (const s of sleepSummaries) {
        const existing = byDate.get(s.date)
        if (!existing || (s.total_timeinbed || 0) > (existing.total_timeinbed || 0)) {
            byDate.set(s.date, s)
        }
    }

    for (const dateStr of Array.from(byDate.keys())) {
        const sleep = byDate.get(dateStr)!
        const date = moment(dateStr, 'YYYY-MM-DD').startOf('day').toDate()

        await prisma.withingsSleep.upsert({
            where: { userId_date: { userId, date } },
            update: {
                startDate: sleep.startdate ? new Date(sleep.startdate * 1000) : null,
                endDate: sleep.enddate ? new Date(sleep.enddate * 1000) : null,
                lightSleepDuration: sleep.lightsleepduration || 0,
                deepSleepDuration: sleep.deepsleepduration || 0,
                remSleepDuration: sleep.remsleepduration || 0,
                wakeupDuration: sleep.wakeupduration || 0,
                wakeupCount: sleep.wakeupcount || 0,
                durationToSleep: sleep.durationtosleep || 0,
                durationToWakeup: sleep.durationtowakeup || 0,
                hrAverage: sleep.hr_average || null,
                hrMin: sleep.hr_min || null,
                hrMax: sleep.hr_max || null,
                rrAverage: sleep.rr_average || null,
                rrMin: sleep.rr_min || null,
                rrMax: sleep.rr_max || null,
                breathingDisturbancesIntensity: sleep.breathing_disturbances_intensity || null,
                snoring: sleep.snoring || null,
                snoringEpisodeCount: sleep.snoringepisodecount || null,
                sleepScore: sleep.sleep_score || null,
                totalSleepTime: sleep.total_sleep_time || 0,
                totalTimeInBed: sleep.total_timeinbed || 0,
                sleepEfficiency: sleep.sleep_efficiency || null,
                sleepLatency: sleep.sleep_latency || null,
                waso: sleep.waso || null,
                outOfBedCount: sleep.out_of_bed_count || null,
                nbRemEpisodes: sleep.nb_rem_episodes || null,
            },
            create: {
                userId,
                date,
                startDate: sleep.startdate ? new Date(sleep.startdate * 1000) : null,
                endDate: sleep.enddate ? new Date(sleep.enddate * 1000) : null,
                lightSleepDuration: sleep.lightsleepduration || 0,
                deepSleepDuration: sleep.deepsleepduration || 0,
                remSleepDuration: sleep.remsleepduration || 0,
                wakeupDuration: sleep.wakeupduration || 0,
                wakeupCount: sleep.wakeupcount || 0,
                durationToSleep: sleep.durationtosleep || 0,
                durationToWakeup: sleep.durationtowakeup || 0,
                hrAverage: sleep.hr_average || null,
                hrMin: sleep.hr_min || null,
                hrMax: sleep.hr_max || null,
                rrAverage: sleep.rr_average || null,
                rrMin: sleep.rr_min || null,
                rrMax: sleep.rr_max || null,
                breathingDisturbancesIntensity: sleep.breathing_disturbances_intensity || null,
                snoring: sleep.snoring || null,
                snoringEpisodeCount: sleep.snoringepisodecount || null,
                sleepScore: sleep.sleep_score || null,
                totalSleepTime: sleep.total_sleep_time || 0,
                totalTimeInBed: sleep.total_timeinbed || 0,
                sleepEfficiency: sleep.sleep_efficiency || null,
                sleepLatency: sleep.sleep_latency || null,
                waso: sleep.waso || null,
                outOfBedCount: sleep.out_of_bed_count || null,
                nbRemEpisodes: sleep.nb_rem_episodes || null,
            },
        })
    }
}

async function syncWorkoutRange(
    accessToken: string,
    userId: number,
    startYmd: string,
    endYmd: string,
) {
    const workouts = await getWorkouts(accessToken, startYmd, endYmd)

    for (const workout of workouts) {
        const startDate = new Date(workout.startdate * 1000)
        const d = workout.data

        await prisma.withingsWorkout.upsert({
            where: { userId_startDate: { userId, startDate } },
            update: {
                category: workout.category,
                categoryName: WORKOUT_CATEGORY_MAP[workout.category] ?? 'Unknown',
                endDate: new Date(workout.enddate * 1000),
                calories: d.calories ?? 0,
                intensity: d.intensity ?? null,
                steps: d.steps ?? 0,
                distance: d.distance ?? 0,
                elevation: d.elevation ?? 0,
                hrAverage: d.hr_average ?? null,
                hrMin: d.hr_min ?? null,
                hrMax: d.hr_max ?? null,
                hrZone0: d.hr_zone_0 ?? 0,
                hrZone1: d.hr_zone_1 ?? 0,
                hrZone2: d.hr_zone_2 ?? 0,
                hrZone3: d.hr_zone_3 ?? 0,
                pauseDuration: d.pause_duration ?? 0,
                spo2Average: d.spo2_average ?? null,
                poolLaps: d.pool_laps ?? null,
                poolLength: d.pool_length ?? null,
                strokes: d.strokes ?? null,
            },
            create: {
                userId,
                category: workout.category,
                categoryName: WORKOUT_CATEGORY_MAP[workout.category] ?? 'Unknown',
                startDate,
                endDate: new Date(workout.enddate * 1000),
                calories: d.calories ?? 0,
                intensity: d.intensity ?? null,
                steps: d.steps ?? 0,
                distance: d.distance ?? 0,
                elevation: d.elevation ?? 0,
                hrAverage: d.hr_average ?? null,
                hrMin: d.hr_min ?? null,
                hrMax: d.hr_max ?? null,
                hrZone0: d.hr_zone_0 ?? 0,
                hrZone1: d.hr_zone_1 ?? 0,
                hrZone2: d.hr_zone_2 ?? 0,
                hrZone3: d.hr_zone_3 ?? 0,
                pauseDuration: d.pause_duration ?? 0,
                spo2Average: d.spo2_average ?? null,
                poolLaps: d.pool_laps ?? null,
                poolLength: d.pool_length ?? null,
                strokes: d.strokes ?? null,
            },
        })
    }
}
