import { sumMacroFromConsumed, getExpectedMacro } from "@/utils/consumed.utils"
import { trpc } from "@/utils/trpc"
import useConsumed from "./useConsumed"

const useDaily = (overwriteWhenAdded?: string) => {
    const {
        data: consumed,
        username,
        whenAdded,
        owner,
    } = useConsumed(overwriteWhenAdded)

    const {
        data: workoutResults = [],
    } = trpc
        .workoutResult
        .getDay
        .useQuery({ whenAdded, username }, { enabled: !!(whenAdded && username) })

    const consumedMacro = sumMacroFromConsumed(consumed)
    const expectedMacro = getExpectedMacro(owner, whenAdded)
    const burnedCalories = workoutResults
        .reduce((previous, { burnedCalories }) => previous + burnedCalories, 0)

    return {
        consumed,
        consumedMacro,
        expectedMacro,
        burnedCalories,
        workoutResults,
    }
}

export default useDaily