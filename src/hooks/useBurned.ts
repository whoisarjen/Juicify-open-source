import { trpc } from "@/utils/trpc.utils"
import { getLocalDayBounds } from "@/utils/global.utils"
import { useMemo } from "react"

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
    const bounds = useMemo(() => ({
        startDate: getLocalDayBounds(startDate).startDate,
        endDate: getLocalDayBounds(endDate).endDate,
    }), [startDate, endDate])

    const [
        { data: burnedCalories = [] },
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

    return {
        burnedCalories,
        workoutResults,
        burnedCaloriesSum: workoutResults.reduce((previous, { burnedCalories }) => previous + burnedCalories, 0),
        burnedCaloriesTotalSum: [...burnedCalories, ...workoutResults].reduce((previous, { burnedCalories }) => previous + burnedCalories, 0),
    }
}

export default useBurned
