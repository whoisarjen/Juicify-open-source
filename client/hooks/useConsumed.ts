import moment from "moment"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"

import { setIsDialogEditConsumed } from "@/redux/features/dialogEditConsumed.slice"
import { trpc } from "@/utils/trpc"
import { useAppDispatch } from "./useRedux"

const useConsumed = (overwriteWhenAdded?: string) => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { data: sessionData } = useSession()

    const username = router.query.login as unknown as string
    const whenAdded = moment(overwriteWhenAdded || router.query.date).toDate()

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

    return {
        data,
        isLoading: isFetching || isLoading || updateConsumed.isLoading || deleteConsumed.isLoading,
        updateConsumed,
        deleteConsumed,
        username,
        whenAdded,
        user: sessionData?.user,
        isOwner: sessionData?.user?.username == username,
    }
}

export default useConsumed