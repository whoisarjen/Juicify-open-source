import BottomFlyingGuestBanner from '@/components/BottomFlyingGuestBanner/BottomFlyingGuestBanner'
import NavbarWorkout from '@/containers/Workout/NavbarWorkout/NavbarWorkout'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextField } from '@mui/material'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import InputAdornment from '@mui/material/InputAdornment'
import ButtonMoreOptionsWorkoutResult from '@/containers/Workout/ButtonMoreOptionsWorkoutResult/ButtonMoreOptionsWorkoutResult'
import BoxResult from '@/containers/Workout/BoxExercise/BoxExercise'
import { pick } from 'lodash'
import { useSession } from 'next-auth/react'
import { trpc } from '@/utils/trpc.utils'
import {
    workoutResultSchema,
    type WorkoutResultSchema,
} from '@/server/schema/workoutResult.schema'
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

    const id = parseInt(router.query.id || 0)
    const username = router.query.login || ''

    const utils = trpc.useContext()

    const deleteWorkoutResult = trpc.workoutResult.delete.useMutation({
        onSuccess: () => {
            utils.workoutResult.getDay.setData(
                { username, whenAdded: today },
                (currentData) =>
                    (currentData || []).filter(
                        (workoutResult) => workoutResult.id !== id
                    )
            )

            utils.workoutResult.getAll.setData({ username }, (currentData) => [
                ...(currentData || []).filter(
                    (workoutPlan) => workoutPlan.id !== id
                ),
            ])

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

            utils.workoutResult.getAll.setData({ username }, (currentData) =>
                updateArray<WorkoutResult>(currentData, data)
            )
        },
    })

    const { data, isFetching } = trpc.workoutResult.get.useQuery(
        { id, username },
        {
            enabled: !!id && !!username,
            onSuccess(data) {
                reset(data)
                setPreviousExercises(
                    data.previousWorkoutResult?.exercises || []
                )
            },
        }
    )

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

    const handleOnSaveWithRouter = async (
        newWorkoutResult: WorkoutResultSchema
    ) =>
        await updateWorkoutResult
            .mutateAsync(newWorkoutResult)
            .then(() => router.push(`/${router.query?.login}/workout/results`))

    useEffect(() => {
        const handleSubmitProxy = () => handleSubmit(handleOnSave)()

        window.addEventListener('blur', handleSubmitProxy)

        return () => {
            window.removeEventListener('blur', handleSubmitProxy)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const isLoading =
        isFetching ||
        updateWorkoutResult.isLoading ||
        deleteWorkoutResult.isLoading

    return (
        <form className="flex flex-1 flex-col gap-3">
            <NavbarWorkout
                isDisabled={isLoading}
                isLoading={isLoading}
                onSave={handleSubmit(handleOnSaveWithRouter)}
                onDelete={() => deleteWorkoutResult.mutate({ id })}
                onArrowBack={() => router.push(`/${username}/workout/results`)}
            />

            <TextField
                variant="outlined"
                label={t('Title')}
                type="text"
                focused
                multiline
                {...register('name')}
                error={!!errors.name}
                helperText={errors.name?.message}
            />

            <DatePicker
                defaultDate={data?.whenAdded || moment().toDate()}
                onChange={(newWhenAdded) => setValue('whenAdded', newWhenAdded)}
                register={register('whenAdded')}
                focused
                maxDateTime={moment().add(2, 'hour').toDate()}
            />

            <TextField
                variant="outlined"
                label={t('Burnt')}
                type="number"
                focused
                {...register('burnedCalories')}
                error={!!errors.burnedCalories}
                helperText={errors.burnedCalories?.message}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">kcal</InputAdornment>
                    ),
                }}
            />

            <TextField
                variant="outlined"
                label={t('Notes')}
                type="text"
                multiline
                focused
                {...register('note')}
                error={!!errors.note}
                helperText={errors.note?.message}
            />

            {data?.workoutPlan?.description && (
                <TextField
                    variant="outlined"
                    label={t('Description of workout plan')}
                    type="text"
                    disabled
                    multiline
                    defaultValue={data.workoutPlan.description}
                />
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
        </form>
    )
}

export default WorkoutResultPage
