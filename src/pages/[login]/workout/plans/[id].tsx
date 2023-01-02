import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import DeleteIcon from '@mui/icons-material/Delete'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { zodResolver } from '@hookform/resolvers/zod'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import BottomFlyingGuestBanner from '@/components/BottomFlyingGuestBanner/BottomFlyingGuestBanner'
import NavbarWorkout from '@/containers/Workout/NavbarWorkout/NavbarWorkout'
import DialogAddExercises from '@/containers/DialogAddExercises/DialogAddExercises'
import InputAdornment from '@mui/material/InputAdornment';
import { useSession } from 'next-auth/react'
import { trpc } from '@/utils/trpc'
import { type WorkoutPlanSchema, workoutPlanSchema, type WorkoutPlanExerciseSchema } from '@/server/schema/workoutPlan.schema'
import { updateArray } from '@/utils/global.utils'

const WorkoutPlan = () => {
    const router: any = useRouter()
    const { t } = useTranslation('workout')
    const { data: sessionData } = useSession()

    const username = router.query.login || ''
    const id = parseInt(router.query.id || 0)

    const utils = trpc.useContext()

    const {
        data,
        isFetching,
    } = trpc
        .workoutPlan
        .get
        .useQuery({ id, username }, {
            enabled: !!id && !!username,
            onSuccess(data) {
                reset({
                    id: data.id,
                    name: data.name,
                    description: data.description,
                    burnedCalories: data.burnedCalories,
                    exercises: data.exercises,
                })
            },
        })

    const updateWorkoutPlan = trpc.workoutPlan.update.useMutation({
        onSuccess(data, variables, context) {
            utils
                .workoutPlan
                .get
                .setData({ id, username }, currentData => {
                    if (currentData?.id === id && sessionData?.user) {
                        return {
                            ...data as unknown as WorkoutPlan,
                            user: sessionData.user as unknown as User,
                        }
                    }

                    return currentData
                })

            utils
                .workoutPlan
                .getAll
                .setData({ username }, currentData => updateArray<WorkoutPlan>(currentData, data))
        },
    })

    const deleteWorkoutPlan = trpc.workoutPlan.delete.useMutation({
        onSuccess: () => {
            utils
                .workoutPlan
                .getAll
                .setData({ username }, currentData =>
                    currentData?.filter(workoutPlan => workoutPlan.id !== id)
                )

            router.push(`/${sessionData?.user?.username}/workout/plans`)
        }
    })

    const isLoading = isFetching || updateWorkoutPlan.isLoading || deleteWorkoutPlan.isLoading

    const {
        register,
        formState: { errors },
        handleSubmit,
        control,
        reset,
    } = useForm<WorkoutPlanSchema>({ resolver: zodResolver(workoutPlanSchema) })

    const {
        fields,
        append,
        remove,
        move,
    } = useFieldArray({ control, name: "exercises", keyName: 'uuid' })

    const handleOnSave = async (newWorkoutPlan: WorkoutPlanSchema) => {
        await updateWorkoutPlan.mutate(newWorkoutPlan)
    }

    const handleOnSaveWithRouter = async (newWorkoutPlan: WorkoutPlanSchema) => {
        await updateWorkoutPlan.mutateAsync(newWorkoutPlan)
            .then(() => router.push(`/${sessionData?.user?.username}/workout/plans`))
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
        <form>
            <NavbarWorkout
                isDisabled={isLoading || !data?.id}
                isLoading={isLoading}
                onSave={handleSubmit(handleOnSaveWithRouter)}
                onDelete={handleOnDelete}
                onArrowBack={() => router.push(`/${sessionData?.user?.username}/workout/plans`)}
            />
            <TextField
                focused
                disabled={!isOwner}
                label={t('NAME_OF_WORKOUT')}
                {...register('name')}
                sx={{ width: '100%', marginTop: '10px' }}
                type="text"
                error={typeof errors.name === 'undefined' ? false : true}
                helperText={errors.name?.message && t(`notify:${errors.name.message || ''}`)}
            />

            <TextField
                variant="outlined"
                label={t("BURNT_CALORIES")}
                type="number"
                focused
                fullWidth
                disabled={!isOwner}
                sx={{ marginTop: '10px' }}
                {...register('burnedCalories')}
                error={!!errors.burnedCalories}
                helperText={errors.burnedCalories?.message && t(`notify:${errors.burnedCalories.message || ''}`)}
                InputProps={{
                    endAdornment: <InputAdornment position="end">kcal</InputAdornment>,
                }}
            />

            <TextField
                focused
                multiline
                disabled={!isOwner}
                label={t('DESCRIPTION')}
                type="text"
                {...register('description')}
                sx={{ width: '100%', marginTop: '10px' }}
                error={typeof errors.description === 'undefined' ? false : true}
                helperText={errors.description?.message && t(`notify:${errors.description.message || ''}`)}
            />
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="exercises">
                    {(provided: any) => (
                        <Stack direction="column" spacing={1} {...provided.droppableProps} ref={provided.innerRef}>
                            {fields.map((exercise, i: number) =>
                                <Draggable key={exercise.id} draggableId={exercise.uuid} index={i}>
                                    {(provided: any) => (
                                        <Chip
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            ref={provided.innerRef}
                                            disabled={!isOwner}
                                            label={`${i + 1}. ${exercise?.name}`}
                                            onDelete={() => remove(i)}
                                            avatar={<SwapVertIcon />}
                                            deleteIcon={<DeleteIcon />}
                                            sx={{
                                                width: '100%',
                                                display: 'grid',
                                                gridTemplateColumns: 'auto 1fr auto',
                                                padding: '0 5px',
                                                height: '44px',
                                                marginTop: '10px'
                                            }}
                                        />
                                    )}
                                </Draggable>
                            )}
                            {provided.placeholder}
                        </Stack>
                    )}
                </Droppable>
            </DragDropContext>
            {data?.userId && isOwner &&
                <DialogAddExercises
                    skipThoseIDS={fields as unknown as WorkoutPlanExercise[]}
                    addThoseExercises={exercises => append(exercises)}
                />
            }
            {data?.userId && !isOwner &&
                <BottomFlyingGuestBanner
                    src={data.user.image}
                    username={data.user.username}
                />
            }
        </form>
    )
}

export default WorkoutPlan;