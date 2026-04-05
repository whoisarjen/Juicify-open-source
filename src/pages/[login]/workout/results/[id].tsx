import BottomFlyingGuestBanner from '@/components/BottomFlyingGuestBanner/BottomFlyingGuestBanner'
import NavbarWorkout from '@/containers/Workout/NavbarWorkout/NavbarWorkout'
import { zodResolver } from '@hookform/resolvers/zod'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import ButtonMoreOptionsWorkoutResult from '@/containers/Workout/ButtonMoreOptionsWorkoutResult/ButtonMoreOptionsWorkoutResult'
import BoxResult from '@/containers/Workout/BoxExercise/BoxExercise'
import { pick } from 'lodash-es'
import { useSession } from 'next-auth/react'
import { trpc } from '@/utils/trpc.utils'
import {
    workoutResultSchema,
    type WorkoutResultSchema,
} from '@/server/schema/workoutResult.schema'
import { keepPreviousData } from '@tanstack/react-query'
import { DatePicker } from '@/components/DatePicker'
import { updateArray } from '@/utils/global.utils'
import moment from 'moment'

const today = moment().format('YYYY-MM-DD')

const WorkoutResultPage = () => {
    const router: any = useRouter()
    const { t } = useTranslation('workout')
    const { data: sessionData } = useSession()
    const [previousExercises, setPreviousExercises] = useState<
        WorkoutResultExercise[]
    >([])
    const [searchAllPlans, setSearchAllPlans] = useState(
        sessionData?.user?.searchAllPlans ?? true
    )
    const [showFinishTimeModal, setShowFinishTimeModal] = useState(false)
    const [pendingFormValues, setPendingFormValues] =
        useState<WorkoutResultSchema | null>(null)

    const id = parseInt(router.query.id || 0)
    const username = router.query.login || ''

    const utils = trpc.useUtils()

    const updateUser = trpc.user.update.useMutation()

    const deleteWorkoutResult = trpc.workoutResult.delete.useMutation({
        onSuccess: () => {
            utils.workoutResult.getDay.setData(
                { username, whenAdded: today },
                (currentData) =>
                    (currentData || []).filter(
                        (workoutResult) => workoutResult.id !== id
                    )
            )

            utils.workoutResult.getAll.setData({ username }, (currentData) => ({
                items: (currentData?.items || []).filter(
                    (workoutPlan) => workoutPlan.id !== id
                ),
                nextCursor: currentData?.nextCursor,
            }))

            router.push(`/${router.query?.login}/workout/results`)
        },
    })

    const updateWorkoutResult = trpc.workoutResult.update.useMutation({
        onSuccess: (data) => {
            utils.workoutResult.getDay.setData(
                { username, whenAdded: today },
                (currentData) => updateArray<WorkoutResult>(currentData, data)
            )

            // TODO update where workoutResult has value as previousWorkoutResult (before offline mode)

            utils.workoutResult.getAll.setData({ username }, (currentData) => ({
                items: updateArray<WorkoutResult>(currentData?.items, data),
                nextCursor: currentData?.nextCursor,
            }))
        },
    })

    const { data, isFetching, isInitialLoading } =
        trpc.workoutResult.get.useQuery(
            { id, username, searchAllPlans },
            {
                enabled: !!id && !!username,
                placeholderData: keepPreviousData,
            }
        )

    useEffect(() => {
        if (data) {
            reset(data)
            setPreviousExercises(
                data.previousWorkoutResult?.exercises || []
            )
        }
    }, [data])

    const {
        register,
        formState: { errors },
        handleSubmit,
        control,
        reset,
        setValue,
    } = useForm<WorkoutResultSchema>({
        resolver: zodResolver(workoutResultSchema),
    })

    const { fields, append, remove, update } = useFieldArray({
        control,
        name: 'exercises',
        keyName: 'uuid',
    })

    const handleOnSave = async (values: WorkoutResultSchema) =>
        await updateWorkoutResult.mutate(values)

    const handleOnSaveWithRouter = (newWorkoutResult: WorkoutResultSchema) => {
        setPendingFormValues(newWorkoutResult)
        setShowFinishTimeModal(true)
    }

    const handleAcceptFinishTime = async () => {
        if (!pendingFormValues) return
        setShowFinishTimeModal(false)
        await updateWorkoutResult
            .mutateAsync({ ...pendingFormValues, finishedAt: new Date() })
            .then(() => router.push(`/${router.query?.login}/workout/results`))
    }

    const handleSkipFinishTime = async () => {
        if (!pendingFormValues) return
        setShowFinishTimeModal(false)
        await updateWorkoutResult
            .mutateAsync(pendingFormValues)
            .then(() => router.push(`/${router.query?.login}/workout/results`))
    }

    const handleCloseFinishTimeModal = () => {
        setShowFinishTimeModal(false)
        setPendingFormValues(null)
    }

    useEffect(() => {
        if (sessionData?.user?.searchAllPlans !== undefined) {
            setSearchAllPlans(sessionData.user.searchAllPlans)
        }
    }, [sessionData?.user?.searchAllPlans])

    useEffect(() => {
        const handleSubmitProxy = () => handleSubmit(handleOnSave)()

        window.addEventListener('blur', handleSubmitProxy)

        return () => {
            window.removeEventListener('blur', handleSubmitProxy)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const isLoading =
        isInitialLoading ||
        updateWorkoutResult.isPending ||
        deleteWorkoutResult.isPending

    return (
        <form className="flex flex-1 flex-col gap-3">
            <NavbarWorkout
                isDisabled={isLoading}
                isLoading={isLoading}
                onSave={handleSubmit(handleOnSaveWithRouter)}
                onDelete={() => deleteWorkoutResult.mutate({ id })}
                onArrowBack={() => router.push(`/${username}/workout/results`)}
            />

            <div>
                <label className="mb-1 block text-sm text-gray-500">{t('Title')}</label>
                <textarea
                    className="w-full rounded border border-gray-300 bg-transparent px-3 py-2 outline-none focus:border-primary-dark dark:border-gray-600"
                    {...register('name')}
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <DatePicker
                defaultDate={data?.whenAdded || moment().toDate()}
                onChange={(newWhenAdded) => setValue('whenAdded', newWhenAdded)}
                register={register('whenAdded')}
                focused
                maxDateTime={moment().add(2, 'hour').toDate()}
            />

            <DatePicker
                label={t('Finished at')}
                defaultDate={
                    data?.finishedAt
                        ? moment(data.finishedAt as unknown as Date).toDate()
                        : moment().toDate()
                }
                onChange={(newFinishedAt) =>
                    setValue('finishedAt', newFinishedAt)
                }
                register={register('finishedAt')}
                focused
                maxDateTime={moment().add(2, 'hour').toDate()}
            />

            <div>
                <label className="mb-1 block text-sm text-gray-500">{t('Burnt')}</label>
                <div className="flex items-center rounded border border-gray-300 focus-within:border-primary-dark dark:border-gray-600">
                    <input
                        className="flex-1 bg-transparent px-3 py-2 outline-none"
                        type="text"
                        inputMode="decimal"
                        {...register('burnedCalories')}
                    />
                    <span className="px-3 text-sm text-gray-500">kcal</span>
                </div>
                {errors.burnedCalories && <p className="mt-1 text-xs text-red-500">{errors.burnedCalories.message}</p>}
            </div>

            <div>
                <label className="mb-1 block text-sm text-gray-500">{t('Notes')}</label>
                <textarea
                    className="w-full rounded border border-gray-300 bg-transparent px-3 py-2 outline-none focus:border-primary-dark dark:border-gray-600"
                    {...register('note')}
                />
                {errors.note && <p className="mt-1 text-xs text-red-500">{errors.note.message}</p>}
            </div>

            {data?.workoutPlan?.description && (
                <div>
                    <label className="mb-1 block text-sm text-gray-500">{t('Description of workout plan')}</label>
                    <textarea
                        className="w-full rounded border border-gray-300 bg-transparent px-3 py-2 outline-none dark:border-gray-600"
                        disabled
                        defaultValue={data.workoutPlan.description}
                    />
                </div>
            )}

            {sessionData?.user?.username == username && (
                <label className="flex items-center gap-2 text-sm">
                    <div
                        role="switch"
                        aria-checked={searchAllPlans}
                        onClick={() => {
                            const newValue = !searchAllPlans
                            setSearchAllPlans(newValue)
                            updateUser.mutate(
                                { searchAllPlans: newValue },
                                {
                                    onError: () =>
                                        setSearchAllPlans(!newValue),
                                }
                            )
                        }}
                        className={`relative h-6 w-11 cursor-pointer rounded-full transition-colors ${searchAllPlans ? 'bg-primary-dark' : 'bg-gray-300 dark:bg-gray-600'}`}
                    >
                        <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${searchAllPlans ? 'translate-x-5' : ''}`} />
                    </div>
                    {t('SEARCH_ALL_PLANS')}
                </label>
            )}

            {fields.map((exercise, index: number) => (
                <div
                    style={
                        fields.length == index + 1
                            ? { marginBottom: '100px' }
                            : {}
                    }
                    key={exercise.uuid}
                >
                    <BoxResult
                        key={exercise.uuid}
                        exercise={exercise}
                        previousExercise={previousExercises.find(
                            (previousExercise: WorkoutResultExercise) =>
                                previousExercise.id === exercise.id
                        )}
                        exerciseFromWorkoutPlan={data?.workoutPlan?.exercises?.find(
                            (exerciseFromWorkoutPlan) =>
                                exerciseFromWorkoutPlan.id === exercise.id
                        )}
                        isOwner={
                            sessionData?.user?.username == data?.user?.username
                        }
                        setNewValues={(
                            results: WorkoutResultExerciseResult[]
                        ) => update(index, { ...exercise, results })}
                        deleteExerciseWithIndex={() => remove(index)}
                    />
                </div>
            ))}

            {sessionData?.user?.username == username && (
                <ButtonMoreOptionsWorkoutResult
                    exercises={fields as unknown as WorkoutResultExercise[]}
                    setExercises={(exercises) =>
                        append(
                            exercises.map((exercise) => ({
                                ...pick(exercise, ['id', 'name']),
                                results: [],
                            }))
                        )
                    }
                />
            )}

            {data?.user.username &&
                sessionData?.user?.username != data?.user.username && (
                    <BottomFlyingGuestBanner
                        src={data?.user.image}
                        username={data?.user.username}
                    />
                )}

            {showFinishTimeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="fixed inset-0 bg-black/50" onClick={handleCloseFinishTimeModal} />
                    <div className="relative z-50 mx-4 w-full max-w-lg rounded-lg bg-white p-0 shadow-xl dark:bg-gray-900">
                        <div className="px-6 pt-6 text-lg font-semibold">{t('Update workout finish time?')}</div>
                        <div className="px-6 py-4">
                            <p className="text-sm text-gray-500">
                                {moment().format('YYYY-MM-DD HH:mm (Z)')}
                            </p>
                        </div>
                        <div className="flex justify-end gap-2 px-6 pb-6">
                            <button className="px-4 py-2 text-primary-dark hover:bg-[rgba(255,255,255,0.04)]" onClick={handleCloseFinishTimeModal}>
                                {t('Close')}
                            </button>
                            <button className="px-4 py-2 text-primary-dark hover:bg-[rgba(255,255,255,0.04)]" onClick={handleSkipFinishTime}>
                                {t('Skip')}
                            </button>
                            <button
                                className="rounded bg-primary-dark px-4 py-2 text-[#121212] hover:bg-[#64b5f6] disabled:opacity-50"
                                onClick={handleAcceptFinishTime}
                            >
                                {t('Accept')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </form>
    )
}

export default WorkoutResultPage
