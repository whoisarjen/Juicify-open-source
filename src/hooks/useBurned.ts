import { trpc } from "@/utils/trpc.utils"
import { getLocalDayBounds } from "@/utils/global.utils"
import { useMemo } from "react"
import { useSession } from "next-auth/react"

interface useBurnedProps {
    username: string
    startDate: string
    endDate: string
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

    // Compute step calories from Withings steps + user weight
    const userWeight = sessionData?.user?.weight ? Number(sessionData.user.weight) : 0
    const steps = dayStats?.steps ?? 0
    const stepCalories = Math.round(steps * 0.00057 * userWeight)

    return {
        burnedCalories,
        workoutResults,
        steps,
        stepCalories,
        burnedCaloriesSum: workoutResults.reduce((previous, { burnedCalories }) => previous + burnedCalories, 0),
        burnedCaloriesTotalSum: stepCalories
            + burnedCalories.reduce((previous, { burnedCalories }) => previous + burnedCalories, 0)
            + workoutResults.reduce((previous, { burnedCalories }) => previous + burnedCalories, 0),
    }
}

export default useBurned
