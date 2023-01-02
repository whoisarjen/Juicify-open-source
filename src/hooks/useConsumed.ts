import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { trpc } from "@/utils/trpc"
import { updateArray } from '@/utils/global.utils'

const useConsumed = (overwriteWhenAdded?: string, overwriteUsername?: string) => {
    const router = useRouter()
    const { data: sessionData } = useSession()

    const username = overwriteUsername || router.query.login as unknown as string
    const whenAdded = overwriteWhenAdded || router.query.date as unknown as string

    const utils = trpc.useContext()

    const {
        data = [],
        isFetching,
        isLoading,
    } = trpc
        .consumed
        .getDay
        .useQuery({ username, whenAdded }, { enabled: !!(username && whenAdded) })

    const updateConsumed = trpc.consumed.update.useMutation({
        onSuccess(data) {
            utils
                .consumed
                .getDay
                .setData({ username, whenAdded }, currentData => updateArray<Consumed & { user: User }>(currentData, data))
        },
    })

    const deleteConsumed = trpc.consumed.delete.useMutation({
        onSuccess(_, variables) {
            utils
                .consumed
                .getDay
                .setData({ username, whenAdded }, currentData => currentData
                    ?.filter(consumed => consumed.id !== variables.id))
        }
    })

    const isOwner = sessionData?.user?.username == username

    return {
        data,
        isLoading: isFetching || isLoading || updateConsumed.isLoading || deleteConsumed.isLoading,
        updateConsumed,
        deleteConsumed,
        username,
        whenAdded,
        isOwner,
        owner: isOwner ? sessionData?.user : null,
    }
}

export default useConsumed
