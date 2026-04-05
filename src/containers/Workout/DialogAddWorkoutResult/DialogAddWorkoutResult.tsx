import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import ButtonPlusIcon from '@/components/ButtonPlusIcon/ButtonPlusIcon'
import { useSession } from 'next-auth/react'
import { trpc } from '@/utils/trpc.utils'
import { orderBy } from 'lodash-es'
import moment from 'moment'

const DialogAddWorkoutResult = () => {
    const { t } = useTranslation('workout')
    const router: any = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const { data: sessionData } = useSession()
    const [whenAdded, setWhenAdded] = useState(moment().format('YYYY-MM-DD'))
    const [choosenWorkoutPlan, setChoosenWorkoutPlan] = useState(0)

    const username = sessionData?.user?.username || ''

    const utils = trpc.useUtils()

    const workoutResultCreate = trpc.workoutResult.create.useMutation({
        onSuccess: (data) => {
            utils
                .workoutResult
                .getAll
                .setData({ username }, currentData => ({
                    items: orderBy(
                        [...(currentData?.items || []), data as unknown as WorkoutResult],
                        ['whenAdded'],
                        ['desc'],
                    ),
                    nextCursor: currentData?.nextCursor,
                }))

            router.push(`/${username}/workout/results/${data.id}`)
        }
    })

    const {
        data: workoutPlans = [],
        isFetching,
    } = trpc
        .workoutPlan
        .getAll
        .useQuery({ username }, { enabled: !!username })

    const handleCreate = () => {
        const workoutPlan = workoutPlans.find(workoutPlan => workoutPlan.id === choosenWorkoutPlan)

        if (!workoutPlan) return

        workoutResultCreate.mutate({ workoutPlanId: workoutPlan.id, whenAdded: moment(whenAdded).toDate() })
    }

    useEffect(() => {
        if (!workoutPlans?.[0]?.id) return

        setChoosenWorkoutPlan(workoutPlans[0].id)
    }, [isFetching, workoutPlans])

    return (
        <>
            <ButtonPlusIcon onClick={() => setIsOpen(true)} />
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
                    <div className="relative z-50 mx-4 w-full max-w-lg rounded-lg bg-white p-0 shadow-xl dark:bg-gray-900">
                        <div className="px-6 pt-6 text-lg font-semibold">{t('CREATE_RESULT')}</div>
                        <div className="px-6 py-4">
                            <p className="text-sm text-gray-500 mb-3">{t('CREATE_RESULT_DESCRIPTION')}</p>

                            <div>
                                <label className="mb-1 block text-sm text-gray-500">{t("Date")}</label>
                                <input
                                    type="date"
                                    className="w-full rounded border border-gray-300 bg-transparent px-3 py-2 outline-none focus:border-primary-dark dark:border-gray-600"
                                    value={whenAdded}
                                    onChange={(e) => setWhenAdded(e.target.value)}
                                />
                            </div>

                            <div className="mt-3">
                                <label className="mb-1 block text-sm text-gray-500">
                                    {t('Workout plan')}
                                </label>
                                <select
                                    className="w-full rounded border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-600"
                                    value={choosenWorkoutPlan || workoutPlans?.[0]?.id}
                                    onChange={event => setChoosenWorkoutPlan(parseInt(event.target.value.toString()))}
                                >
                                    {workoutPlans?.map(workoutPlan =>
                                        <option
                                            value={workoutPlan.id}
                                            key={workoutPlan.id}
                                        >{workoutPlan.name}</option>
                                    )}
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 px-6 pb-6">
                            <button className="px-4 py-2 text-primary-dark hover:bg-[rgba(255,255,255,0.04)]" onClick={() => setIsOpen(false)}>{t('Cancel')}</button>
                            <button
                                disabled={workoutResultCreate.isPending || !choosenWorkoutPlan || !whenAdded}
                                onClick={handleCreate}
                                className="rounded bg-primary-dark px-4 py-2 text-[#121212] hover:bg-[#64b5f6] disabled:opacity-50"
                            >
                                {workoutResultCreate.isPending ? (
                                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                ) : (
                                    t('Submit')
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default DialogAddWorkoutResult;
