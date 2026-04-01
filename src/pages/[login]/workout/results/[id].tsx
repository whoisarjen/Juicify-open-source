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
        <form className="flex flex-1 flex-col gap-2">
            <NavbarWorkout
                isDisabled={isLoading}
                isLoading={isLoading}
                onSave={handleSubmit(handleOnSaveWithRouter)}
                onDelete={() => deleteWorkoutResult.mutate({ id })}
                onArrowBack={() => router.push(`/${username}/workout/results`)}
            />

            {/* Win2k window body */}
            <div className="win2k-window p-3 flex flex-col gap-2">
                <div>
                    <label className="mb-px block text-[10px] text-[#444444]">{t('Title')}</label>
                    <textarea
                        className="w-full win2k-sunken bg-white px-2 py-1 text-[11px] text-black outline-none resize-none"
                        rows={2}
                        {...register('name')}
                    />
                    {errors.name && <p className="mt-1 text-[10px] text-red-600">{errors.name.message}</p>}
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
                    <label className="mb-px block text-[10px] text-[#444444]">{t('Burnt')}</label>
                    <div className="flex items-center win2k-sunken">
                        <input
                            className="flex-1 bg-white px-2 py-1 text-[11px] text-black outline-none"
                            type="number"
                            {...register('burnedCalories')}
                        />
                        <span className="px-2 text-[10px] text-[#444444]">kcal</span>
                    </div>
                    {errors.burnedCalories && <p className="mt-1 text-[10px] text-red-600">{errors.burnedCalories.message}</p>}
                </div>

                <div>
                    <label className="mb-px block text-[10px] text-[#444444]">{t('Notes')}</label>
                    <textarea
                        className="w-full win2k-sunken bg-white px-2 py-1 text-[11px] text-black outline-none resize-none"
                        rows={2}
                        {...register('note')}
                    />
                    {errors.note && <p className="mt-1 text-[10px] text-red-600">{errors.note.message}</p>}
                </div>

                {data?.workoutPlan?.description && (
                    <div>
                        <label className="mb-px block text-[10px] text-[#444444]">{t('Description of workout plan')}</label>
                        <textarea
                            className="w-full win2k-sunken bg-[#e8e4d8] px-2 py-1 text-[11px] text-[#444444] outline-none resize-none"
                            rows={2}
                            disabled
                            defaultValue={data.workoutPlan.description}
                        />
                    </div>
                )}

                {sessionData?.user?.username == username && (
                    <label className="flex items-center gap-2 text-[11px] text-black cursor-pointer">
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
                            className={`relative h-5 w-10 cursor-pointer transition-colors win2k-sunken ${searchAllPlans ? 'bg-[#0a246a]' : 'bg-[#d4d0c8]'}`}
                        >
                            <span className={`absolute top-0.5 left-0.5 h-4 w-4 bg-[#d4d0c8] shadow win2k-raised transition-transform ${searchAllPlans ? 'translate-x-5' : ''}`} />
                        </div>
                        {t('SEARCH_ALL_PLANS')}
                    </label>
                )}
            </div>

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
                    {/* Win2k dialog window */}
                    <div className="relative z-50 w-full max-w-sm win2k-window">
                        {/* Title bar */}
                        <div className="win2k-titlebar px-2 py-1">
                            <span className="text-[11px]">⚠️</span>
                            <span className="flex-1 text-[11px] font-bold text-white">{t('Update workout finish time?')}</span>
                            <button
                                className="win2k-btn !px-1 !py-0 !min-h-0 h-[14px] w-[16px] text-[10px] font-bold leading-none flex items-center justify-center text-black"
                                onClick={handleCloseFinishTimeModal}
                                aria-label="close"
                            >✕</button>
                        </div>
                        {/* Content */}
                        <div className="px-4 py-3 bg-[#d4d0c8]">
                            <p className="text-[11px] text-black">
                                {moment().format('YYYY-MM-DD HH:mm (Z)')}
                            </p>
                        </div>
                        {/* Footer buttons */}
                        <div className="flex justify-end gap-2 px-4 pb-3 bg-[#d4d0c8]">
                            <button className="win2k-btn" onClick={handleCloseFinishTimeModal}>
                                {t('Close')}
                            </button>
                            <button className="win2k-btn" onClick={handleSkipFinishTime}>
                                {t('Skip')}
                            </button>
                            <button className="win2k-btn font-bold" onClick={handleAcceptFinishTime}>
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
