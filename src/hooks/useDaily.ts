import { sumMacroFromConsumed, getExpectedMacro } from "@/utils/consumed.utils"
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
    } = useBurned(props)

    const consumedMacro = sumMacroFromConsumed(consumed)
    const expectedMacro = getExpectedMacro(username == sessionData?.user?.username ? sessionData?.user : null, startDate)

    return {
        consumed,
        consumedMacro,
        expectedMacro,
        burnedCalories,
        workoutResults,
        burnedCaloriesSum,
    }
}

export default useDaily