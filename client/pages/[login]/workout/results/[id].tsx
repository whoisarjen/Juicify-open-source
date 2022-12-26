import BottomFlyingGuestBanner from "@/components/BottomFlyingGuestBanner/BottomFlyingGuestBanner"
import NavbarWorkout from "@/containers/Workout/NavbarWorkout/NavbarWorkout"
import { useAppSelector } from "@/hooks/useRedux"
import { zodResolver } from "@hookform/resolvers/zod"
import { TextField } from "@mui/material"
import useTranslation from "next-translate/useTranslation"
import { useRouter } from "next/router"
import { useCallback, useEffect, useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import InputAdornment from '@mui/material/InputAdornment';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ButtonMoreOptionsWorkoutResult from "@/containers/Workout/ButtonMoreOptionsWorkoutResult/ButtonMoreOptionsWorkoutResult"
import BoxResult from "@/containers/Workout/BoxExercise/BoxExercise"
import { omit } from "lodash"
import {
    ExerciseResultSchemaProps,
    ExerciseSchemaProps,
    WorkoutResultSchemaProps,
    WorkoutResultSchema,
} from "@/containers/Workout/workout.schema"
import {
    ExerciseFieldsFragment,
    useDeleteWorkoutResultMutation,
    useUpdateWorkoutResultMutation,
    useWorkoutResultQuery
} from "@/generated/graphql"
import { useSession } from "next-auth/react"

const sxTextField = { width: '100%', marginTop: '10px' }

const WorkoutResultPage = () => {
    const router: any = useRouter()
    const { t } = useTranslation('workout')
    const { data: sessionData } = useSession()
    const [when, setWhen] = useState<null | string>(null)
    const [previousExercises, setPreviousExercises] = useState([])

    const [{ data, fetching, error }, getWorkoutResult] = useWorkoutResultQuery({
        variables: {
            id: router?.query?.id,
        },
        pause: true,
    })
    const [{ fetching: fetchingUpdate }, updateWorkoutResult] = useUpdateWorkoutResultMutation()
    const [{ fetching: fetchingDelete }, deleteWorkoutResult] = useDeleteWorkoutResultMutation()

    useEffect(() => {
        if (router?.query?.id) {
            getWorkoutResult()
        }
    }, [router?.query?.id])

    const handleOnDelete = async () => {
        await deleteWorkoutResult({ id: router.query.id })
        router.push(`/${router.query?.login}/workout/results`)
    }

    const updateResults = async ({
        results,
        exercise,
        index
    }: {
        results: Array<ExerciseResultSchemaProps>,
        exercise: ExerciseSchemaProps,
        index: number
    }) => {
        update(index, { ...exercise, results })
    }

    const {
        register,
        formState: { errors },
        handleSubmit,
        control,
        reset,
        setValue
    } = useForm<WorkoutResultSchemaProps>({
        resolver: zodResolver(WorkoutResultSchema)
    })

    const {
        fields,
        append,
        remove,
        update
    } = useFieldArray({ control, name: "exercises", keyName: 'uuid' })

    const handleOnSave = useCallback(async (values: WorkoutResultSchemaProps) => {
        await updateWorkoutResult({
            ...values,
            exercises: JSON.stringify(values.exercises?.map(exercise => ({
                ...omit(exercise, ['uuid']),
                results: exercise?.results?.map((result: any) => !result.open ? omit(result, ['open']) : result),
            })))
        })
    }, [updateWorkoutResult])

    const handleOnSaveWithRouter = useCallback(async (values: WorkoutResultSchemaProps) => {
        await updateWorkoutResult({
            ...values,
            exercises: JSON.stringify(values.exercises?.map(exercise => ({
                ...omit(exercise, ['uuid']),
                results: exercise?.results?.map((result: any) => !result.open ? omit(result, ['open']) : result),
            })))
        })
        router.push(`/${router.query?.login}/workout/results`)
    }, [router, updateWorkoutResult])

    useEffect(() => {
        window.addEventListener('blur', () => handleSubmit(handleOnSave)())

        return window.removeEventListener('blur', () => handleSubmit(handleOnSave)());
    }, [handleOnSave, handleSubmit])

    useEffect(() => {
        if (data?.workoutResult) {
            reset({
                ...data.workoutResult,
                exercises: JSON.parse(data.workoutResult.exercises || '[]')
            })
        }
        if (data?.previousWorkoutResult) {
            setPreviousExercises(JSON.parse(data.previousWorkoutResult.exercises || '[]'))
        }
    }, [data?.workoutResult?.id])

    useEffect(() => {
        if (error) {
            router.push(`/${router.query?.login}/workout/results`)
        }
    }, [error])

    const onWhenChange = (newDate: string | null) => {
        if (newDate) {
            setValue('when', new Date(newDate).toISOString().slice(0, 10))
        }
        setWhen(newDate)
    }

    return (
        <form>
            <NavbarWorkout
                isLoading={fetching || fetchingUpdate || fetchingDelete}
                onSave={handleSubmit(handleOnSaveWithRouter)}
                onDelete={handleOnDelete}
                onArrowBack={() => router.push(`/${router.query?.login}/workout/results`)}
            />
            
            <TextField
                variant="outlined"
                label={t("Title")}
                type="text"
                sx={sxTextField}
                focused
                multiline
                {...register('name')}
                error={!!errors.name}
                helperText={errors.name?.message && t(`notify:${errors.name.message || ''}`)}
            />

            {data?.workoutResult?.workoutPlan?.description &&
                <TextField
                    variant="outlined"
                    label={t("Description of workout plan")}
                    type="text"
                    sx={sxTextField}
                    disabled
                    multiline
                    defaultValue={data.workoutResult.workoutPlan.description}
                />
            }

            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <MobileDatePicker
                    value={when || data?.workoutResult?.when}
                    onChange={onWhenChange}
                    label={t("Date")}
                    inputFormat="dd.MM.yyyy"
                    renderInput={(params: any) => 
                    <TextField {...register('when')} focused sx={sxTextField} {...params} />}
                />
            </LocalizationProvider>
            
            <TextField
                variant="outlined"
                label={t("Burnt")}
                type="number"
                focused
                sx={sxTextField}
                {...register('burnedCalories')}
                error={!!errors.burnedCalories}
                helperText={errors.burnedCalories?.message && t(`notify:${errors.burnedCalories.message || ''}`)}
                InputProps={{
                    endAdornment: <InputAdornment position="end">kcal</InputAdornment>,
                }}
            />
            
            <TextField
                variant="outlined"
                label={t("Notes")}
                type="text"
                sx={sxTextField}
                multiline
                focused
                {...register('note')}
                error={!!errors.note}
                helperText={errors.note?.message && t(`notify:${errors.note.message || ''}`)}
            />

            {fields.map((exercise, index: number) =>
                <div style={fields.length == (index + 1) ? { marginBottom: '100px' } : {}} key={exercise.uuid}>
                    <BoxResult
                        key={exercise.uuid}
                        exercise={exercise}
                        previousExercise={previousExercises.find((previousExercise: ExerciseSchemaProps) => previousExercise?.id === exercise.id)}
                        isOwner={sessionData?.user?.username == data?.workoutResult?.user?.username}
                        setNewValues={(results: Array<ExerciseResultSchemaProps>) => updateResults({ results, exercise, index })}
                        deleteExerciseWithIndex={() => remove(index)}
                    />
                </div>
            )}

            {sessionData?.user?.username == router?.query?.login &&
                <ButtonMoreOptionsWorkoutResult
                    exercises={fields as unknown as ExerciseFieldsFragment[]}
                    setExercises={exercises => append(exercises.map(exercise => ({ ...exercise, results: [] })))}
                />
            }

            {data?.workoutResult?.user.username && sessionData?.user?.username != data?.workoutResult?.user.username &&
                <BottomFlyingGuestBanner
                    id={data?.workoutResult?.user.id}
                    username={data?.workoutResult?.user.username}
                />
            }
        </form>
    );
}

export default WorkoutResultPage;