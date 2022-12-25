import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import DeleteIcon from '@mui/icons-material/Delete'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { useAppSelector } from '@/hooks/useRedux'
import { zodResolver } from '@hookform/resolvers/zod'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import BottomFlyingGuestBanner from '@/components/BottomFlyingGuestBanner/BottomFlyingGuestBanner'
import NavbarWorkout from '@/containers/Workout/NavbarWorkout/NavbarWorkout'
import { ExerciseFieldsFragment, useDeleteWorkoutPlanMutation, useUpdateWorkoutPlanMutation, useWorkoutPlanQuery } from '@/generated/graphql'
import DialogAddExercises from '@/containers/DialogAddExercises/DialogAddExercises'
import { WorkoutPlanSchemaProps, WorkoutPlanSchema } from '@/containers/Workout/workout.schema'
import InputAdornment from '@mui/material/InputAdornment';

const WorkoutPlan = () => {
    const router: any = useRouter()
    const { t } = useTranslation('workout')
    const token = useAppSelector(state => state.token)
    const [, updateWorkoutPlan] = useUpdateWorkoutPlanMutation()
    const [, deleteWorkoutPlan] = useDeleteWorkoutPlanMutation()

    const [{ data, fetching, error }, getWorkoutPlan] = useWorkoutPlanQuery({
        variables: {
            id: router?.query?.id,
        },
        pause: true,
    })

    const { register, formState: { errors }, handleSubmit, control, reset } = useForm<WorkoutPlanSchemaProps>({
        resolver: zodResolver(WorkoutPlanSchema)
    })

    useEffect(() => {
        if (data?.workoutPlan?.id) {
            reset({
                id: data.workoutPlan.id,
                name: data.workoutPlan.name,
                description: data.workoutPlan.description,
                burnedCalories: data.workoutPlan.burnedCalories,
                user: data.workoutPlan.user?.id,
                exercises: JSON.parse(data.workoutPlan?.exercises || '[]'),
            })
        }
    }, [data?.workoutPlan?.id, data?.workoutPlan?.exercises?.length])

    const {
        fields,
        append,
        remove,
        move
    } = useFieldArray({ control, name: "exercises", keyName: 'uuid' })

    const handleOnSave = useCallback(async (newWorkoutPlan: WorkoutPlanSchemaProps) => {
        if (data?.workoutPlan?.id) {
            await updateWorkoutPlan({
                ...newWorkoutPlan,
                exercises: JSON.stringify(newWorkoutPlan?.exercises)
            })
        }
    }, [data?.workoutPlan?.id, updateWorkoutPlan])

    const handleOnSaveWithRouter = useCallback(async (newWorkoutPlan: WorkoutPlanSchemaProps) => {
        if (data?.workoutPlan?.id) {
            await updateWorkoutPlan({
                ...newWorkoutPlan,
                exercises: JSON.stringify(newWorkoutPlan?.exercises)
            })
            router.push(`/${token.username}/workout/plans`)
        }
    }, [data?.workoutPlan?.id, router, token.username, updateWorkoutPlan])

    useEffect(() => {
        window.addEventListener('blur', () => handleSubmit(handleOnSave)())

        return window.removeEventListener('blur', () => handleSubmit(handleOnSave)());
    }, [handleOnSave, handleSubmit])

    useEffect(() => {
        if (error) {
            router.push(`/${router.query?.login}/workout/plans`)
        }
    }, [error])

    const handleOnDelete = async () => {
        if (data?.workoutPlan?.id) {
            await deleteWorkoutPlan({
                id: data.workoutPlan.id,
            })
            router.push(`/${token.username}/workout/plans`)
        }
    }

    const handleOnDragEnd = (result: any) => {
        if (!result.destination) return
        move(result.source.index, result.destination.index)
    }

    const isOwner = token?.id == data?.workoutPlan?.user?.id

    useEffect(() => {
        if (router?.query?.id) {
            getWorkoutPlan()
        }
    }, [router?.query?.id])

    return (
        <form>
            <NavbarWorkout
                isLoading={fetching}
                onSave={handleSubmit(handleOnSaveWithRouter)}
                onDelete={handleOnDelete}
                onArrowBack={() => router.push(`/${token.username}/workout/plans`)}
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
                                <Draggable key={exercise.id} draggableId={exercise.id} index={i}>
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
            {data?.workoutPlan?.user?.id && isOwner &&
                <DialogAddExercises
                    skipThoseIDS={fields as unknown as ExerciseFieldsFragment[]}
                    addThoseExercises={exercises => append(exercises)}
                />
            }
            {data?.workoutPlan?.user?.id && !isOwner &&
                <BottomFlyingGuestBanner
                    id={data.workoutPlan.user.id}
                    username={data.workoutPlan.user.username}
                />
            }
        </form>
    )
}

export default WorkoutPlan;