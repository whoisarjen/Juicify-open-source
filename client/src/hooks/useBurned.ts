import { trpc } from "@/utils/trpc.utils"

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
    const [
        { data: burnedCalories = [] },
        { data: workoutResults = [] },
    ] = trpc.useQueries(t => [
        t
            .burnedCalories
            .getPeriod({
                username,
                startDate,
                endDate,
            }, { enabled: !!username && !!startDate && !!endDate }),
        t
            .workoutResult
            .getPeriod({
                username,
                startDate,
                endDate,
            }, { enabled: !!username && !!startDate && !!endDate }),
    ])

    return {
        burnedCalories,
        workoutResults,
        burnedCaloriesSum: [...burnedCalories, ...workoutResults].reduce((previous, { burnedCalories }) => previous + burnedCalories, 0),
    }
}

export default useBurned