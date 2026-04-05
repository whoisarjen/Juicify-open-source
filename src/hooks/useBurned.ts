import { trpc } from "@/utils/trpc.utils"
import { getLocalDayBounds } from "@/utils/global.utils"
import { useMemo } from "react"
import { useSession } from "next-auth/react"

interface useBurnedProps {
    username: string
    startDate: string
    endDate: string
}

// MET values by Withings workout category (from Compendium of Physical Activities)
const CATEGORY_MET: Record<number, number> = {
    1: 3.5,   // Walk
    2: 0,     // Run — calculated from pace
    3: 6.0,   // Hiking
    4: 7.0,   // Skating
    5: 8.5,   // BMX
    6: 7.5,   // Bicycling
    7: 6.0,   // Swimming
    8: 3.0,   // Surfing
    9: 5.0,   // Kitesurfing
    10: 5.0,  // Windsurfing
    11: 7.0,  // Tennis
    12: 4.0,  // Table Tennis
    13: 7.3,  // Squash
    14: 5.5,  // Badminton
    15: 5.0,  // Lift Weights
    16: 3.8,  // Calisthenics
    17: 5.0,  // Elliptical
    18: 3.0,  // Pilates
    19: 6.5,  // Basketball
    20: 7.0,  // Soccer
    21: 8.0,  // Football
    22: 8.0,  // Rugby
    23: 4.0,  // Volleyball
    24: 10.0, // Waterpolo
    25: 4.0,  // Horse Riding
    26: 4.8,  // Golf
    27: 2.5,  // Yoga
    28: 4.8,  // Dancing
    29: 7.8,  // Boxing
    30: 7.0,  // Fencing
    31: 7.0,  // Wrestling
    32: 7.0,  // Martial Arts
    33: 4.0,  // Skiing
    34: 7.0,  // Snowboarding
    35: 3.5,  // Other
    36: 8.0,  // Rowing
    188: 5.0, // Multi-sport
    191: 3.5, // Wheelchair
    307: 8.0, // Indoor running
    308: 5.0, // Indoor cycling
}


export interface WithingsWorkoutCalc {
    categoryName: string | null
    steps: number
    durationMin: number
    netCalories: number
    distance: number
}

const useBurned = ({
    username,
    startDate,
    endDate,
}: useBurnedProps) => {
    const { data: sessionData } = useSession()
    const bounds = useMemo(() => ({
        startDate: getLocalDayBounds(startDate).startDate,
        endDate: getLocalDayBounds(endDate).endDate,
    }), [startDate, endDate])

    const isOwner = username === sessionData?.user?.username

    const [
        { data: rawBurnedCalories = [] },
        { data: workoutResults = [] },
    ] = trpc.useQueries(t => [
        t
            .burnedCalories
            .getPeriod({
                username,
                startDate: bounds.startDate,
                endDate: bounds.endDate,
            }, { enabled: !!username && !!startDate && !!endDate }),
        t
            .workoutResult
            .getPeriod({
                username,
                startDate: bounds.startDate,
                endDate: bounds.endDate,
            }, { enabled: !!username && !!startDate && !!endDate }),
    ])

    const { data: dayStats } = trpc.withings.dayStats.useQuery(
        { date: startDate },
        { enabled: isOwner && !!startDate }
    )

    // Filter out old Withings burned entries (now computed from steps)
    const burnedCalories = rawBurnedCalories.filter(b => b.source !== 'withings')

    const userWeight = sessionData?.user?.weight ? Number(sessionData.user.weight) : 0
    const userHeight = sessionData?.user?.height ?? 0 // cm
    const userSex = sessionData?.user?.sex ?? true // true = male

    // Calculate Withings workout calories using MET formulas
    // Exclude walks (category 1) — walk MET ≈ step formula, no added accuracy
    const withingsWorkouts: WithingsWorkoutCalc[] = useMemo(() => {
        if (!dayStats?.workouts || userWeight === 0) return []
        return dayStats.workouts.filter(w => w.category !== 1).map(w => {
            const durationHours = w.durationMin / 60

            let netCalories: number
            if (w.category === 2 && w.distance > 0) {
                // Running: Margaria's rule — ~1 kcal/kg/km, validated gold standard
                netCalories = Math.round(userWeight * (w.distance / 1000))
            } else {
                // Other activities: MET-based
                const met = CATEGORY_MET[w.category] ?? 3.5
                netCalories = Math.round((met - 1) * userWeight * durationHours)
            }

            return {
                categoryName: w.categoryName,
                steps: w.steps,
                durationMin: Math.round(w.durationMin),
                netCalories,
                distance: w.distance,
            }
        })
    }, [dayStats?.workouts, userWeight])

    // Deduct workout steps from daily total to avoid double-counting
    const workoutSteps = withingsWorkouts.reduce((sum, w) => sum + w.steps, 0)
    const netSteps = Math.max(0, (dayStats?.steps ?? 0) - workoutSteps)
    // Margaria walking (0.5 kcal/kg/km) + height-based stride length
    // Matches ACSM VO2 walking equation within 1%
    const strideKm = (userHeight / 100) * (userSex ? 0.414 : 0.413) / 1000
    const stepCalories = Math.round(netSteps * strideKm * 0.5 * userWeight)
    const withingsWorkoutCalories = withingsWorkouts.reduce((sum, w) => sum + w.netCalories, 0)

    return {
        burnedCalories,
        workoutResults,
        steps: netSteps,
        totalSteps: dayStats?.steps ?? 0,
        stepCalories,
        withingsWorkouts,
        withingsWorkoutCalories,
        burnedCaloriesSum: workoutResults.reduce((previous, { burnedCalories }) => previous + burnedCalories, 0),
        burnedCaloriesTotalSum: stepCalories
            + withingsWorkoutCalories
            + burnedCalories.reduce((previous, { burnedCalories }) => previous + burnedCalories, 0)
            + workoutResults.reduce((previous, { burnedCalories }) => previous + burnedCalories, 0),
    }
}

export default useBurned
