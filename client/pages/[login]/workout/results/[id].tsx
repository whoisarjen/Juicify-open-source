import BottomFlyingGuestBanner from "@/components/BottomFlyingGuestBanner/BottomFlyingGuestBanner"
import NavbarWorkout from "@/containers/Workout/NavbarWorkout/NavbarWorkout"
import { zodResolver } from "@hookform/resolvers/zod"
import { TextField } from "@mui/material"
import useTranslation from "next-translate/useTranslation"
import { useRouter } from "next/router"
import { useCallback, useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import InputAdornment from '@mui/material/InputAdornment';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ButtonMoreOptionsWorkoutResult from "@/containers/Workout/ButtonMoreOptionsWorkoutResult/ButtonMoreOptionsWorkoutResult"
import BoxResult from "@/containers/Workout/BoxExercise/BoxExercise"
import { pick } from "lodash"
import { useSession } from "next-auth/react"
import { trpc } from '@/utils/trpc'
import { workoutResultSchema, type WorkoutResultSchema } from "@/server/schema/workoutResult.schema"

const sxTextField = { width: '100%', marginTop: '10px' }

const WorkoutResultPage = () => {
    const router: any = useRouter()
    const { t } = useTranslation('workout')
    const { data: sessionData } = useSession()
    const [when, setWhen] = useState<null | string>(null)
    const [previousExercises, setPreviousExercises] = useState([])

    const deleteWorkoutResult = trpc.workoutResult.delete.useMutation({
        onSuccess: () => {
            router.push(`/${router.query?.login}/workout/results`)
        }
    })

    const updateWorkoutResult = trpc.workoutResult.update.useMutation()

    const {
        data,
        isFetching,
    } = trpc
        .workoutResult
        .get
        .useQuery({ id: parseInt(router.query.id), username: router.query.login }, {
            enabled: !!(router.query.id && router.query.login),
            onSuccess(data) {
                reset(data)
            },
        })

    const {
        register,
        formState: { errors },
        handleSubmit,
        control,
        reset,
        setValue
    } = useForm<WorkoutResultSchema>({ resolver: zodResolver(workoutResultSchema) })

    const {
        fields,
        append,
        remove,
        update,
    } = useFieldArray({ control, name: "exercises", keyName: 'uuid' })

    // const handleOnSave = useCallback(async (values: WorkoutResultSchema) => {
    //     await updateWorkoutResult({
    //         ...values,
    //         exercises: JSON.stringify(values.exercises?.map(exercise => ({
    //             ...omit(exercise, ['uuid']),
    //             results: exercise?.results?.map((result: any) => !result.open ? omit(result, ['open']) : result),
    //         })))
    //     })
    // }, [updateWorkoutResult])

    const handleOnSaveWithRouter = useCallback(async (newWorkoutResult: WorkoutResultSchema) => {
        await updateWorkoutResult.mutate(newWorkoutResult)
        router.push(`/${router.query?.login}/workout/results`)
    }, [router, updateWorkoutResult])

    // useEffect(() => {
    //     window.addEventListener('blur', () => handleSubmit(handleOnSave)())

    //     return window.removeEventListener('blur', () => handleSubmit(handleOnSave)());
    // }, [handleOnSave, handleSubmit])

    const onWhenChange = (newDate: string | null) => {
        if (newDate) {
            setValue('whenAdded', new Date(newDate))
        }

        setWhen(newDate)
    }

    const isLoading = isFetching || updateWorkoutResult.isLoading || deleteWorkoutResult.isLoading

    return (
        <form>
            <NavbarWorkout
                isDisabled={isLoading}
                isLoading={isLoading}
                onSave={handleSubmit(handleOnSaveWithRouter)}
                onDelete={() => deleteWorkoutResult.mutate({ id: parseInt(router.query.id) })}
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

            {data?.workoutPlan?.description &&
                <TextField
                    variant="outlined"
                    label={t("Description of workout plan")}
                    type="text"
                    sx={sxTextField}
                    disabled
                    multiline
                    defaultValue={data.workoutPlan.description}
                />
            }

            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <MobileDatePicker
                    value={when || data?.whenAdded}
                    onChange={onWhenChange}
                    label={t("Date")}
                    inputFormat="dd.MM.yyyy"
                    renderInput={(params: any) =>
                        <TextField {...register('whenAdded')} focused sx={sxTextField} {...params} />}
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
                        previousExercise={previousExercises.find((previousExercise: WorkoutResultExercise) => previousExercise?.id === exercise.id)}
                        isOwner={sessionData?.user?.username == data?.user?.username}
                        setNewValues={(results: WorkoutResultExerciseResult[]) => update(index, { ...exercise, results })}
                        deleteExerciseWithIndex={() => remove(index)}
                    />
                </div>
            )}

            {sessionData?.user?.username == router?.query?.login &&
                <ButtonMoreOptionsWorkoutResult
                    exercises={fields as unknown as WorkoutResultExercise[]}
                    setExercises={exercises => append(exercises.map(exercise => ({ ...pick(exercise, ['id', 'name']), results: [] })))}
                />
            }

            {data?.user.username && sessionData?.user?.username != data?.user.username &&
                <BottomFlyingGuestBanner
                    src={data?.user.image}
                    username={data?.user.username}
                />
            }
        </form>
    );
}

export default WorkoutResultPage;