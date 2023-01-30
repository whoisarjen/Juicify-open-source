import { trpc } from "@/utils/trpc.utils"
import { updateArray } from '@/utils/global.utils'

interface useConsumedProps {
    username: string
    startDate: string
    endDate: string
}

const useConsumed = ({
    username,
    startDate,
    endDate,
}: useConsumedProps) => {
    const utils = trpc.useContext()

    const {
        data = [],
        isFetching,
        isLoading,
    } = trpc.consumed.getPeriod.useQuery({ username, startDate, endDate }, { enabled: !!username && !!startDate && !!endDate })

    const updateConsumed = trpc.consumed.update.useMutation({
        onSuccess(data) {
            utils
                .consumed
                .getPeriod
                .setData({ username, startDate, endDate }, currentData =>
                    updateArray<Consumed & { user: Pick<User, 'id' | 'username' | 'image'> }>(currentData, data))
        },
    })

    const deleteConsumed = trpc.consumed.delete.useMutation({
        onSuccess(_, variables) {
            utils
                .consumed
                .getPeriod
                .setData({ username, startDate, endDate }, currentData => currentData
                    ?.filter(consumed => consumed.id !== variables.id))
        }
    })

    return {
        data,
        isLoading: isFetching || isLoading || updateConsumed.isLoading || deleteConsumed.isLoading,
        updateConsumed,
        deleteConsumed,
    }
}

export default useConsumed
