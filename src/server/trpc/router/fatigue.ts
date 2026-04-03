import { z } from 'zod'
import moment from 'moment'
import { router, protectedProcedure } from '../trpc'
import { getCalories } from '@/utils/consumed.utils'

/**
 * Recovery Score v2 — Evidence-based fatigue detection
 *
 * Architecture: Weighted composite of z-score deviations from individual baselines.
 * Baseline: 30-day rolling window EXCLUDING the most recent 7 days (hybrid approach,
 * prevents current fatigue from contaminating the reference — Buchheit 2014, Altini & Plews 2021).
 *
 * Signals (10 total, max penalty in parentheses):
 *
 * ── SLEEP ──
 *  1. Sleep score trend           (-15)  Withings sleep score, 7d vs baseline z-score
 *  2. Sleep duration & debt       (-15)  Total sleep time + cumulative 7d debt
 *  3. Sleep efficiency & WASO     (-10)  SE <85% threshold + WASO >30min
 *  4. Sleep HR min (HRV proxy)    (-12)  Both directions: elevation = sympathetic OT,
 *                                         depression = parasympathetic OT (Plews 2013)
 *  5. Sleep HR min CV             (-8)   Day-to-day variability >5% = autonomic instability
 *
 * ── NUTRITION ──
 *  6. Energy deficit              (-12)  Consumed vs TDEE, with deficit×load multiplier
 *  7. Protein adequacy            (-8)   Per kg body weight (Morton 2018: 1.6 g/kg target)
 *
 * ── TRAINING ──
 *  8. ACWR via EWMA              (-10)  Acute:chronic workload ratio (Gabbett 2016)
 *  9. Training monotony           (-8)   Foster's formula: mean/SD <2.0 = danger
 * 10. Consecutive training days   (-8)   Compounding fatigue beyond what ACWR captures
 *
 * Total possible penalty: 106 (allows overlap so multiple mild signals still produce a meaningful drop)
 * Score = max(0, min(100, 100 - totalPenalty))
 *
 * Levels (5-tier, from UX research — progressive guidance):
 *  85-100  Fresh     — push your limits
 *  65-84   Good      — train normally
 *  45-64   Moderate  — lighter load, prioritize recovery
 *  25-44   Fatigued  — deload: halve volume, maintain intensity
 *  0-24    Critical  — rest day, eat at maintenance, sleep 9h+
 */

const BASELINE_WINDOW = 30  // days for chronic reference
const ACUTE_WINDOW = 7      // days for acute state
const BASELINE_GAP = 7      // exclude recent 7d from baseline (Altini & Plews 2021)
const MIN_BASELINE = 10     // minimum data points for reliable baseline
const MIN_COLD_START = 5    // absolute minimum before showing any score

type Level = 'fresh' | 'good' | 'moderate' | 'fatigued' | 'critical'
type SignalStatus = 'green' | 'amber' | 'red'

interface Signal {
    name: string
    status: SignalStatus
    detail: string
}

interface FatigueResult {
    score: number
    level: Level
    title: string
    description: string
    suggestion: string
    signals: Signal[]
    dataPoints: number
    confidence: 'high' | 'moderate' | 'low'
}

// ─── Helpers ───────────────────────────────────────────────

const avg = (nums: number[]) => nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0
const std = (nums: number[]) => {
    if (nums.length < 2) return 0
    const m = avg(nums)
    return Math.sqrt(nums.reduce((s, v) => s + (v - m) ** 2, 0) / (nums.length - 1))
}
const cv = (nums: number[]) => {
    const m = avg(nums)
    return m > 0 ? (std(nums) / m) * 100 : 0
}
const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi)

/** Z-score: positive = above baseline (e.g., HR rising = bad), negative = below */
const zScore = (acuteAvg: number, baselineAvg: number, baselineStd: number) =>
    baselineStd > 0 ? (acuteAvg - baselineAvg) / baselineStd : 0

// ─── Level definitions with UX-optimized language ──────────
// Positive framing even for low scores (UX research: reframe rest as active strategy)

function getLevel(score: number): Omit<FatigueResult, 'score' | 'signals' | 'dataPoints' | 'confidence'> {
    if (score >= 85) return {
        level: 'fresh',
        title: 'Fresh',
        description: 'Your body is well recovered across all signals.',
        suggestion: 'Great day to push your limits — consider a PR attempt or adding a set to your main lifts.',
    }
    if (score >= 65) return {
        level: 'good',
        title: 'Good',
        description: 'Recovery looks solid with minor signals to watch.',
        suggestion: 'Train as planned. Keep your nutrition and sleep consistent.',
    }
    if (score >= 45) return {
        level: 'moderate',
        title: 'Moderate',
        description: 'Your body is working hard to adapt. Multiple recovery signals are trending down.',
        suggestion: 'Drop accessories, keep compound lifts at the same weight but stop 1-2 reps earlier. Replace HIIT with easy cardio.',
    }
    if (score >= 25) return {
        level: 'fatigued',
        title: 'Fatigued',
        description: 'Significant fatigue is accumulating. Continuing at full load risks digging a deeper hole.',
        suggestion: 'Deload: cut volume in half, maintain weights, skip HIIT entirely. Eat at maintenance — don\'t cut calories during a deload.',
    }
    return {
        level: 'critical',
        title: 'Rest day',
        description: 'Your body is showing strong signs of overreaching. Rest is how the gains actually lock in.',
        suggestion: 'Take a full rest day. Eat at maintenance or slight surplus, aim for 9+ hours of sleep. Light walking is fine.',
    }
}

// ─── Volume load from workout exercises JSON ───────────────

function computeVolumeLoad(exercises: unknown): number {
    let volume = 0
    try {
        if (!Array.isArray(exercises)) return 0
        for (const ex of exercises) {
            const results = (ex as { results?: unknown[] }).results
            if (!Array.isArray(results)) continue
            for (const set of results) {
                const s = set as { reps?: number; weight?: number }
                volume += (s.reps ?? 0) * (s.weight ?? 0)
            }
        }
    } catch { /* invalid structure */ }
    return volume
}

// ─── Main router ───────────────────────────────────────────

export const fatigueRouter = router({
    getScore: protectedProcedure
        .input(z.object({ date: z.string() }))
        .query(async ({ ctx, input: { date } }) => {
            const userId = ctx.session.user.id
            const target = moment(date, 'YYYY-MM-DD')
            const windowStart = target.clone().subtract(BASELINE_WINDOW + BASELINE_GAP, 'days').startOf('day').toDate()
            const targetEnd = target.clone().endOf('day').toDate()

            // ── Fetch all data in parallel ──
            const [sleep, activities, consumed, burnedCal, workoutResults, latestMeasurement] = await Promise.all([
                ctx.prisma.withingsSleep.findMany({
                    where: { userId, date: { gte: windowStart, lte: targetEnd } },
                    orderBy: { date: 'asc' },
                }),
                ctx.prisma.withingsActivity.findMany({
                    where: { userId, date: { gte: windowStart, lte: targetEnd } },
                    orderBy: { date: 'asc' },
                }),
                ctx.prisma.consumed.findMany({
                    where: { userId, whenAdded: { gte: windowStart, lte: targetEnd } },
                    include: { product: true },
                }),
                ctx.prisma.burnedCalories.findMany({
                    where: { userId, whenAdded: { gte: windowStart, lte: targetEnd } },
                }),
                ctx.prisma.workoutResult.findMany({
                    where: { userId, whenAdded: { gte: windowStart, lte: targetEnd } },
                }),
                ctx.prisma.measurement.findFirst({
                    where: { userId },
                    orderBy: { whenAdded: 'desc' },
                    select: { weight: true },
                }),
            ])

            const weightKg = latestMeasurement ? Number(latestMeasurement.weight) : 0

            const signals: Signal[] = []
            let totalPenalty = 0

            // ── Split data into baseline (older) and acute (recent 7d) ──
            // Baseline: [target - 37d, target - 7d) — excludes recent week
            const acuteStart = target.clone().subtract(ACUTE_WINDOW, 'days').startOf('day')
            const baselineEnd = acuteStart.clone() // baseline ends where acute starts
            const baselineStart = target.clone().subtract(BASELINE_WINDOW + BASELINE_GAP, 'days').startOf('day')

            const inBaseline = (d: moment.Moment) => d.isSameOrAfter(baselineStart) && d.isBefore(baselineEnd)
            const inAcute = (d: moment.Moment) => d.isSameOrAfter(acuteStart) && d.isSameOrBefore(target)

            // ═══════════════════════════════════════════════════════════
            // SIGNAL 1: Sleep score trend (max penalty: 15)
            // ═══════════════════════════════════════════════════════════
            const sleepWithDates = sleep.map(s => ({ ...s, m: moment(s.date) }))

            const baselineSleepScores = sleepWithDates.filter(s => inBaseline(s.m) && s.sleepScore != null).map(s => s.sleepScore!)
            const acuteSleepScores = sleepWithDates.filter(s => inAcute(s.m) && s.sleepScore != null).map(s => s.sleepScore!)

            if (baselineSleepScores.length >= MIN_BASELINE && acuteSleepScores.length >= 3) {
                const z = zScore(avg(acuteSleepScores), avg(baselineSleepScores), std(baselineSleepScores))
                // Negative z = score dropped (bad)
                if (z < -1.5) {
                    totalPenalty += 15
                    signals.push({ name: 'Sleep quality', status: 'red', detail: `Dropped to ${avg(acuteSleepScores).toFixed(0)} (baseline ${avg(baselineSleepScores).toFixed(0)})` })
                } else if (z < -0.75) {
                    totalPenalty += 8
                    signals.push({ name: 'Sleep quality', status: 'amber', detail: `Declining (${avg(acuteSleepScores).toFixed(0)} vs ${avg(baselineSleepScores).toFixed(0)})` })
                } else {
                    signals.push({ name: 'Sleep quality', status: 'green', detail: `Stable (${avg(acuteSleepScores).toFixed(0)})` })
                }
            }

            // ═══════════════════════════════════════════════════════════
            // SIGNAL 2: Sleep duration + cumulative debt (max penalty: 15)
            // Van Dongen 2003: debt is cumulative and doesn't plateau
            // ═══════════════════════════════════════════════════════════
            const acuteSleepHours = sleepWithDates
                .filter(s => inAcute(s.m) && s.totalSleepTime > 0)
                .map(s => s.totalSleepTime / 3600)

            if (acuteSleepHours.length >= 3) {
                const avgHours = avg(acuteSleepHours)
                const sleepNeed = 8 // default; could be personalized
                const weekDebt = acuteSleepHours.reduce((debt, h) => debt + Math.max(0, sleepNeed - h), 0)

                // Consecutive short nights check
                let consecutiveShort = 0
                for (let i = acuteSleepHours.length - 1; i >= 0; i--) {
                    if (acuteSleepHours[i]! < 6) consecutiveShort++
                    else break
                }

                if (avgHours < 6 || weekDebt > 10 || consecutiveShort >= 3) {
                    totalPenalty += 15
                    signals.push({ name: 'Sleep duration', status: 'red', detail: `${avgHours.toFixed(1)}h avg, ${weekDebt.toFixed(0)}h debt this week` })
                } else if (avgHours < 7 || weekDebt > 5 || consecutiveShort >= 2) {
                    totalPenalty += 8
                    signals.push({ name: 'Sleep duration', status: 'amber', detail: `${avgHours.toFixed(1)}h avg (${weekDebt.toFixed(0)}h debt)` })
                } else {
                    signals.push({ name: 'Sleep duration', status: 'green', detail: `${avgHours.toFixed(1)}h avg` })
                }
            }

            // ═══════════════════════════════════════════════════════════
            // SIGNAL 3: Sleep efficiency + WASO (max penalty: 10)
            // AASM: SE <85% = clinical threshold
            // ═══════════════════════════════════════════════════════════
            const acuteSleepQuality = sleepWithDates.filter(s =>
                inAcute(s.m) && s.sleepEfficiency != null
            )

            if (acuteSleepQuality.length >= 3) {
                const avgSE = avg(acuteSleepQuality.map(s => Number(s.sleepEfficiency)))
                const avgWASO = avg(acuteSleepQuality.filter(s => s.waso != null).map(s => s.waso! / 60)) // minutes

                let penalty = 0
                if (avgSE < 80) penalty += 7
                else if (avgSE < 85) penalty += 4

                if (avgWASO > 45) penalty += 3
                else if (avgWASO > 30) penalty += 1

                penalty = Math.min(penalty, 10)
                totalPenalty += penalty

                const status: SignalStatus = penalty >= 7 ? 'red' : penalty >= 3 ? 'amber' : 'green'
                signals.push({
                    name: 'Sleep efficiency',
                    status,
                    detail: `${avgSE.toFixed(0)}% efficiency${avgWASO > 0 ? `, ${avgWASO.toFixed(0)}min awake` : ''}`,
                })
            }

            // ═══════════════════════════════════════════════════════════
            // SIGNAL 4: Sleep HR min — HRV proxy (max penalty: 12)
            // Altini & Plews 2021: r = -0.82 with lnRMSSD
            // BOTH directions: elevation = sympathetic OT, depression = parasympathetic OT
            // ═══════════════════════════════════════════════════════════
            const baselineHrMins = sleepWithDates.filter(s => inBaseline(s.m) && s.hrMin != null && s.hrMin > 0).map(s => s.hrMin!)
            const acuteHrMins = sleepWithDates.filter(s => inAcute(s.m) && s.hrMin != null && s.hrMin > 0).map(s => s.hrMin!)

            if (baselineHrMins.length >= MIN_BASELINE && acuteHrMins.length >= 3) {
                const z = zScore(avg(acuteHrMins), avg(baselineHrMins), std(baselineHrMins))
                const absZ = Math.abs(z) // flag BOTH directions

                if (absZ > 2) {
                    totalPenalty += 12
                    const dir = z > 0 ? 'Elevated' : 'Abnormally low'
                    signals.push({ name: 'Resting HR', status: 'red', detail: `${dir} (${avg(acuteHrMins).toFixed(0)} vs ${avg(baselineHrMins).toFixed(0)} bpm)` })
                } else if (absZ > 1) {
                    totalPenalty += 6
                    const dir = z > 0 ? 'Rising' : 'Dropping'
                    signals.push({ name: 'Resting HR', status: 'amber', detail: `${dir} (${avg(acuteHrMins).toFixed(0)} vs ${avg(baselineHrMins).toFixed(0)} bpm)` })
                } else {
                    signals.push({ name: 'Resting HR', status: 'green', detail: `Normal (${avg(acuteHrMins).toFixed(0)} bpm)` })
                }
            }

            // ═══════════════════════════════════════════════════════════
            // SIGNAL 5: Sleep HR min CV (max penalty: 8)
            // Plews 2013: CV >10% = significant autonomic disturbance
            // ═══════════════════════════════════════════════════════════
            if (acuteHrMins.length >= 4) {
                const hrCV = cv(acuteHrMins)

                if (hrCV > 10) {
                    totalPenalty += 8
                    signals.push({ name: 'HR variability', status: 'red', detail: `Erratic (CV ${hrCV.toFixed(1)}% — normal <5%)` })
                } else if (hrCV > 5) {
                    totalPenalty += 4
                    signals.push({ name: 'HR variability', status: 'amber', detail: `Elevated (CV ${hrCV.toFixed(1)}%)` })
                } else {
                    signals.push({ name: 'HR variability', status: 'green', detail: `Stable (CV ${hrCV.toFixed(1)}%)` })
                }
            }

            // ═══════════════════════════════════════════════════════════
            // SIGNAL 6: Energy deficit with load interaction (max penalty: 12)
            // RED-S: deficit × high load = multiplicative risk (Stellingwerff 2018)
            // ═══════════════════════════════════════════════════════════
            const consumedByDay = new Map<string, number>()
            for (const c of consumed) {
                const day = moment(c.whenAdded).format('YYYY-MM-DD')
                const cal = getCalories(c.product) * Number(c.howMany)
                consumedByDay.set(day, (consumedByDay.get(day) ?? 0) + cal)
            }

            const tdeeByDay = new Map<string, number>()
            for (const a of activities) {
                const day = moment(a.date).format('YYYY-MM-DD')
                tdeeByDay.set(day, Math.round(Number(a.totalCalories)))
            }

            // Build daily load map (needed for deficit×load interaction and signals 8-10)
            const dailyLoad = new Map<string, number>()
            const workoutDays = new Set<string>()

            for (const w of workoutResults) {
                const day = moment(w.whenAdded).format('YYYY-MM-DD')
                workoutDays.add(day)
                const vol = computeVolumeLoad(w.exercises)
                const load = vol > 0 ? vol : w.burnedCalories
                dailyLoad.set(day, (dailyLoad.get(day) ?? 0) + load)
            }
            for (const b of burnedCal) {
                const day = moment(b.whenAdded).format('YYYY-MM-DD')
                workoutDays.add(day)
                dailyLoad.set(day, (dailyLoad.get(day) ?? 0) + b.burnedCalories)
            }

            if (tdeeByDay.size >= 7) {
                const deficits: number[] = []
                let hasHighLoad = false

                for (let i = 0; i < ACUTE_WINDOW; i++) {
                    const day = target.clone().subtract(i, 'days').format('YYYY-MM-DD')
                    const intake = consumedByDay.get(day)
                    const tdee = tdeeByDay.get(day)
                    if (intake != null && tdee != null && tdee > 0) {
                        deficits.push(intake - tdee)
                    }
                    if ((dailyLoad.get(day) ?? 0) > 0) hasHighLoad = true
                }

                if (deficits.length >= 3) {
                    let avgDeficit = avg(deficits)

                    // Multiplicative interaction: deficit + training = worse (Stellingwerff 2018)
                    const loadMultiplier = hasHighLoad ? 1.3 : 1.0
                    const effectiveDeficit = avgDeficit * loadMultiplier

                    if (effectiveDeficit < -750) {
                        totalPenalty += 12
                        signals.push({ name: 'Energy deficit', status: 'red', detail: `Severe (~${Math.abs(Math.round(avgDeficit))} kcal/day${hasHighLoad ? ' + high training' : ''})` })
                    } else if (effectiveDeficit < -400) {
                        totalPenalty += 6
                        signals.push({ name: 'Energy deficit', status: 'amber', detail: `Moderate (~${Math.abs(Math.round(avgDeficit))} kcal/day)` })
                    } else {
                        signals.push({ name: 'Energy balance', status: 'green', detail: avgDeficit < -100 ? `Mild deficit (~${Math.abs(Math.round(avgDeficit))} kcal)` : 'On target' })
                    }
                }
            }

            // ═══════════════════════════════════════════════════════════
            // SIGNAL 7: Protein adequacy (max penalty: 8)
            // Morton 2018: 1.6 g/kg optimal, Hector & Phillips 2018: 1.8-2.7 in deficit
            // ═══════════════════════════════════════════════════════════
            if (weightKg > 0) {
                const proteinByDay = new Map<string, number>()
                for (const c of consumed) {
                    const day = moment(c.whenAdded).format('YYYY-MM-DD')
                    const p = Number(c.product.proteins) * Number(c.howMany)
                    proteinByDay.set(day, (proteinByDay.get(day) ?? 0) + p)
                }

                const recentProtein: number[] = []
                for (let i = 0; i < ACUTE_WINDOW; i++) {
                    const day = target.clone().subtract(i, 'days').format('YYYY-MM-DD')
                    const p = proteinByDay.get(day)
                    if (p != null) recentProtein.push(p / weightKg)
                }

                if (recentProtein.length >= 3) {
                    const avgP = avg(recentProtein)

                    if (avgP < 1.2) {
                        totalPenalty += 8
                        signals.push({ name: 'Protein', status: 'red', detail: `Low (${avgP.toFixed(1)} g/kg — target 1.6+)` })
                    } else if (avgP < 1.6) {
                        totalPenalty += 4
                        signals.push({ name: 'Protein', status: 'amber', detail: `Below optimal (${avgP.toFixed(1)} g/kg)` })
                    } else {
                        signals.push({ name: 'Protein', status: 'green', detail: `Good (${avgP.toFixed(1)} g/kg)` })
                    }
                }
            }

            // ═══════════════════════════════════════════════════════════
            // SIGNAL 8: ACWR via EWMA (max penalty: 10)
            // Williams 2017 EWMA approach, Gabbett 2016 zones
            // ═══════════════════════════════════════════════════════════
            if (dailyLoad.size >= MIN_BASELINE) {
                const lambdaAcute = 2 / (ACUTE_WINDOW + 1)
                const lambdaChronic = 2 / (BASELINE_WINDOW + 1)
                let ewmaA = 0, ewmaC = 0, init = false

                for (let i = BASELINE_WINDOW + BASELINE_GAP; i >= 0; i--) {
                    const day = target.clone().subtract(i, 'days').format('YYYY-MM-DD')
                    const load = dailyLoad.get(day) ?? 0
                    if (!init) { ewmaA = load; ewmaC = load; init = true }
                    else {
                        ewmaA = load * lambdaAcute + ewmaA * (1 - lambdaAcute)
                        ewmaC = load * lambdaChronic + ewmaC * (1 - lambdaChronic)
                    }
                }

                if (ewmaC > 0) {
                    const acwr = ewmaA / ewmaC
                    if (acwr > 1.5) {
                        totalPenalty += 10
                        signals.push({ name: 'Training load', status: 'red', detail: `Spike detected (ACWR ${acwr.toFixed(2)} — safe 0.8-1.3)` })
                    } else if (acwr > 1.3 || acwr < 0.5) {
                        totalPenalty += 5
                        signals.push({ name: 'Training load', status: 'amber', detail: acwr > 1.3 ? `Building (ACWR ${acwr.toFixed(2)})` : `Low (ACWR ${acwr.toFixed(2)})` })
                    } else {
                        signals.push({ name: 'Training load', status: 'green', detail: `Balanced (ACWR ${acwr.toFixed(2)})` })
                    }
                }
            }

            // ═══════════════════════════════════════════════════════════
            // SIGNAL 9: Training monotony (max penalty: 8)
            // Foster: monotony >2.0 = danger, even at moderate total load
            // ═══════════════════════════════════════════════════════════
            const weekLoads: number[] = []
            for (let i = 0; i < ACUTE_WINDOW; i++) {
                const day = target.clone().subtract(i, 'days').format('YYYY-MM-DD')
                weekLoads.push(dailyLoad.get(day) ?? 0)
            }

            if (weekLoads.some(l => l > 0)) {
                const weekStd = std(weekLoads)
                const weekMean = avg(weekLoads)
                const monotony = weekStd > 0 ? weekMean / weekStd : (weekMean > 0 ? 10 : 0)

                if (monotony > 2.5) {
                    totalPenalty += 8
                    signals.push({ name: 'Training variety', status: 'red', detail: `Very uniform (monotony ${monotony.toFixed(1)} — add rest days or easy days)` })
                } else if (monotony > 2.0) {
                    totalPenalty += 4
                    signals.push({ name: 'Training variety', status: 'amber', detail: `Low variety (monotony ${monotony.toFixed(1)})` })
                } else {
                    signals.push({ name: 'Training variety', status: 'green', detail: `Good variation` })
                }
            }

            // ═══════════════════════════════════════════════════════════
            // SIGNAL 10: Consecutive training days (max penalty: 8)
            // Halson & Jeukendrup 2004: consecutive days compound beyond ACWR
            // ═══════════════════════════════════════════════════════════
            if (workoutDays.size > 0) {
                let consecutive = 0
                for (let i = 0; i < 14; i++) {
                    const day = target.clone().subtract(i, 'days').format('YYYY-MM-DD')
                    if (workoutDays.has(day)) consecutive++
                    else break
                }

                if (consecutive >= 7) {
                    totalPenalty += 8
                    signals.push({ name: 'Rest days', status: 'red', detail: `${consecutive} days straight — your body needs a rest day` })
                } else if (consecutive >= 5) {
                    totalPenalty += 4
                    signals.push({ name: 'Rest days', status: 'amber', detail: `${consecutive} day streak — consider resting soon` })
                } else {
                    signals.push({ name: 'Rest days', status: 'green', detail: consecutive > 0 ? `${consecutive} day streak` : 'Rest day' })
                }
            }

            // ═══════════════════════════════════════════════════════════
            // COMPUTE FINAL SCORE + CONFIDENCE
            // ═══════════════════════════════════════════════════════════
            const score = clamp(100 - totalPenalty, 0, 100)
            const levelInfo = getLevel(score)

            // Confidence based on signal coverage
            const confidence: FatigueResult['confidence'] =
                signals.length >= 7 ? 'high' :
                signals.length >= 4 ? 'moderate' : 'low'

            return {
                score,
                ...levelInfo,
                signals,
                dataPoints: signals.length,
                confidence,
            } satisfies FatigueResult
        }),
})
