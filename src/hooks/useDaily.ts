import { sumMacroFromConsumed, getExpectedMacro, getMinMacro } from "@/utils/consumed.utils"
import { useSession } from "next-auth/react"
import useBurned from "./useBurned"
import useConsumed from "./useConsumed"

interface useDailyProps {
    username: string
    startDate: string
    endDate: string
}

const useDaily = (props: useDailyProps) => {
    const { data: sessionData } = useSession()
    const {
        data: consumed,
    } = useConsumed(props)

    const { username, startDate } = props

    const {
        burnedCalories,
        workoutResults,
        burnedCaloriesSum,
        burnedCaloriesTotalSum,
    } = useBurned(props)

    const user = username == sessionData?.user?.username ? sessionData?.user : null
    const consumedMacro = sumMacroFromConsumed(consumed)
    const expectedMacro = getExpectedMacro(user, startDate)
    const minMacro = getMinMacro(user, startDate)

    return {
        consumed,
        consumedMacro,
        expectedMacro,
        minMacro,
        burnedCalories,
        workoutResults,
        burnedCaloriesSum,
        burnedCaloriesTotalSum,
    }
}

export default useDaily