import { useRouter } from "next/router"
import { useSession } from "next-auth/react"

import { setIsDialogEditConsumed } from "@/redux/features/dialogEditConsumed.slice"
import { trpc } from "@/utils/trpc"
import { useAppDispatch } from "./useRedux"

const useConsumed = (overwriteWhenAdded?: string, overwriteUsername?: string) => {
    const router = useRouter()
    const dispatch = useAppDispatch()
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
            dispatch(setIsDialogEditConsumed(false))

            utils
                .consumed
                .getDay
                .setData({ username, whenAdded }, currentData => currentData
                    ?.map(consumed => {
                        if (consumed.id === data.id) {
                            return {
                                ...consumed,
                                ...data,
                            }
                        }

                        return consumed
                    }))
        },
    })

    const deleteConsumed = trpc.consumed.delete.useMutation({
        onSuccess(_, variables) {
            dispatch(setIsDialogEditConsumed(false))

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
