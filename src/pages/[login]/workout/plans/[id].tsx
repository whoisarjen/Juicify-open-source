
import { Trash2, ArrowUpDown } from 'lucide-react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { zodResolver } from '@hookform/resolvers/zod'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import BottomFlyingGuestBanner from '@/components/BottomFlyingGuestBanner/BottomFlyingGuestBanner'
import NavbarWorkout from '@/containers/Workout/NavbarWorkout/NavbarWorkout'
import DialogAddExercises from '@/containers/DialogAddExercises/DialogAddExercises'
import { useSession } from 'next-auth/react'
import { trpc } from '@/utils/trpc.utils'
import {
    type WorkoutPlanSchema,
    workoutPlanSchema,
} from '@/server/schema/workoutPlan.schema'
import { updateArray } from '@/utils/global.utils'
import { range } from 'lodash-es'
import { CustomTextField } from '@/components/CustomTextField'
import DialogConfirm from '@/components/DialogConfirm/DialogConfirm'

const SERIES = range(1, 11)
const REPS = range(1, 101)
const RIR = range(0, 6, 0.5)

const WorkoutPlan = () => {
    const router: any = useRouter()
    const { t } = useTranslation('workout')
    const { data: sessionData } = useSession()

    const username = router.query.login || ''
    const id = parseInt(router.query.id || 0)

    const utils = trpc.useUtils()

    const { data, isFetching } = trpc.workoutPlan.get.useQuery(
        { id, username },
        {
            enabled: !!id && !!username,
        }
    )

    const updateWorkoutPlan = trpc.workoutPlan.update.useMutation({
        onSuccess(data) {
            utils.workoutPlan.get.setData({ id, username }, (currentData) => {
                if (currentData?.id === id && sessionData?.user) {
                    return {
                        ...(data as unknown as WorkoutPlan),
                        user: sessionData.user as unknown as User,
                    }
                }

                return currentData
            })

            utils.workoutPlan.getAll.setData({ username }, (currentData) =>
                updateArray<WorkoutPlan>(currentData, data)
            )
        },
    })

    const deleteWorkoutPlan = trpc.workoutPlan.delete.useMutation({
        onSuccess: () => {
            utils.workoutPlan.getAll.setData({ username }, (currentData) =>
                currentData?.filter((workoutPlan) => workoutPlan.id !== id)
            )

            router.push(`/${sessionData?.user?.username}/workout/plans`)
        },
    })

    const isLoading =
        isFetching || updateWorkoutPlan.isPending || deleteWorkoutPlan.isPending

    const {
        register,
        formState: { errors },
        handleSubmit,
        control,
        reset,
    } = useForm<WorkoutPlanSchema>({ resolver: zodResolver(workoutPlanSchema) })

    useEffect(() => {
        if (data) {
            reset({
                id: data.id,
                name: data.name,
                description: data.description,
                burnedCalories: data.burnedCalories,
                exercises: data.exercises,
            })
        }
    }, [data, reset])

    const { fields, append, remove, move, update } = useFieldArray({
        control,
        name: 'exercises',
        keyName: 'uuid',
    })

    const handleOnSave = async (newWorkoutPlan: WorkoutPlanSchema) => {
        await updateWorkoutPlan.mutate(newWorkoutPlan)
    }

    const handleOnSaveWithRouter = async (
        newWorkoutPlan: WorkoutPlanSchema
    ) => {
        await updateWorkoutPlan
            .mutateAsync(newWorkoutPlan)
            .then(() =>
                router.push(`/${sessionData?.user?.username}/workout/plans`)
            )
    }

    useEffect(() => {
        const handleSubmitProxy = () => handleSubmit(handleOnSave)()

        window.addEventListener('blur', handleSubmitProxy)

        return window.removeEventListener('blur', handleSubmitProxy)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleOnDelete = async () => {
        if (!data?.id) return

        await deleteWorkoutPlan.mutate({ id: data.id })
    }

    const handleOnDragEnd = (result: any) => {
        if (!result.destination) return

        move(result.source.index, result.destination.index)
    }

    const isOwner = sessionData?.user?.id == data?.userId

    return (
        <form className="flex flex-1 flex-col gap-2">
            <NavbarWorkout
                isDisabled={isLoading || !data?.id}
                isLoading={isLoading}
                onSave={handleSubmit(handleOnSaveWithRouter)}
                onDelete={handleOnDelete}
                onArrowBack={() =>
                    router.push(`/${sessionData?.user?.username}/workout/plans`)
                }
            />
            <div>
                <label className="mb-1 block text-sm text-gray-500">{t('NAME_OF_WORKOUT')}</label>
                <input
                    className="w-full rounded border border-gray-300 bg-transparent px-3 py-2 outline-none focus:border-primary-dark dark:border-gray-600"
                    disabled={!isOwner}
                    type="text"
                    {...register('name')}
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div>
                <label className="mb-1 block text-sm text-gray-500">{t('BURNT_CALORIES')}</label>
                <div className="flex items-center rounded border border-gray-300 focus-within:border-primary-dark dark:border-gray-600">
                    <input
                        className="flex-1 bg-transparent px-3 py-2 outline-none"
                        type="number"
                        disabled={!isOwner}
                        {...register('burnedCalories')}
                    />
                    <span className="px-3 text-sm text-gray-500">kcal</span>
                </div>
                {errors.burnedCalories && <p className="mt-1 text-xs text-red-500">{errors.burnedCalories.message}</p>}
            </div>

            <div>
                <label className="mb-1 block text-sm text-gray-500">{t('DESCRIPTION')}</label>
                <textarea
                    className="w-full rounded border border-gray-300 bg-transparent px-3 py-2 outline-none focus:border-primary-dark dark:border-gray-600"
                    disabled={!isOwner}
                    {...register('description')}
                />
                {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
            </div>

            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="exercises">
                    {(provided: any) => (
                        <div
                            className="mt-2.5 flex flex-col gap-2"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {fields.map((exercise, i: number) => (
                                <Draggable
                                    key={exercise.id}
                                    draggableId={exercise.uuid}
                                    index={i}
                                    isDragDisabled={!isOwner}
                                >
                                    {(provided: any) => (
                                        <div
                                            className="flex flex-1 flex-col text-sm"
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            ref={provided.innerRef}
                                        >
                                            <div className="flex flex-1 flex-row items-center justify-center rounded bg-primary-dark p-3 text-center text-[#121212]">
                                                <ArrowUpDown />
                                                <div className="flex-1">{`${
                                                    i + 1
                                                }. ${exercise.name}`}</div>
                                                <DialogConfirm
                                                    onConfirmed={() =>
                                                        remove(i)
                                                    }
                                                    isDisabled={!isOwner}
                                                >
                                                    <Trash2 size={20} />
                                                </DialogConfirm>
                                            </div>
                                            <div>
                                                <div className="mt-2.5">
                                                    <label className="mb-1 block text-sm text-gray-500">Series</label>
                                                    <select
                                                        className="w-full rounded border border-gray-300 bg-transparent px-3 py-2 outline-none focus:border-primary-dark dark:border-gray-600"
                                                        value={exercise.series ?? 1}
                                                        onChange={(e) =>
                                                            update(i, {
                                                                ...exercise,
                                                                series: Number(e.target.value),
                                                            })
                                                        }
                                                        disabled={!isOwner}
                                                    >
                                                        {SERIES.map((opt) => (
                                                            <option key={opt} value={opt}>{opt}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="mt-2.5">
                                                    <label className="mb-1 block text-sm text-gray-500">Reps</label>
                                                    <select
                                                        className="w-full rounded border border-gray-300 bg-transparent px-3 py-2 outline-none focus:border-primary-dark dark:border-gray-600"
                                                        value={exercise.reps ?? 1}
                                                        onChange={(e) =>
                                                            update(i, {
                                                                ...exercise,
                                                                reps: Number(e.target.value),
                                                            })
                                                        }
                                                        disabled={!isOwner}
                                                    >
                                                        {REPS.map((opt) => (
                                                            <option key={opt} value={opt}>{opt}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="mt-2.5">
                                                    <label className="mb-1 block text-sm text-gray-500">RIR</label>
                                                    <select
                                                        className="w-full rounded border border-gray-300 bg-transparent px-3 py-2 outline-none focus:border-primary-dark dark:border-gray-600"
                                                        value={exercise.rir ?? 1}
                                                        onChange={(e) =>
                                                            update(i, {
                                                                ...exercise,
                                                                rir: Number(e.target.value),
                                                            })
                                                        }
                                                        disabled={!isOwner}
                                                    >
                                                        {RIR.map((opt) => (
                                                            <option key={opt} value={opt}>{opt}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <CustomTextField
                                                multiline
                                                disabled={!isOwner}
                                                label={t('Notes')}
                                                type="text"
                                                className="mt-2.5 w-full"
                                                defaultValue={exercise.note}
                                                onChange={(note) =>
                                                    update(i, {
                                                        ...exercise,
                                                        note,
                                                    })
                                                }
                                            />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            {data?.userId && isOwner && (
                <DialogAddExercises
                    skipThoseIDS={fields as unknown as WorkoutPlanExercise[]}
                    addThoseExercises={(exercises) => append(exercises)}
                />
            )}
            {data?.userId && !isOwner && (
                <BottomFlyingGuestBanner
                    src={data.user.image}
                    username={data.user.username}
                />
            )}
        </form>
    )
}

export default WorkoutPlan
