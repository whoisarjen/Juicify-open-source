import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import DialogConfirm from '@/components/DialogConfirm/DialogConfirm'
import { useState, useEffect } from 'react'
import BoxResult from '../BoxResult/BoxResult'
import ButtonPlusIcon from '@/components/ButtonPlusIcon/ButtonPlusIcon'
import { omit } from 'lodash'
import {
    type WorkoutResultExerciseResultSchema,
    type WorkoutResultExerciseSchema,
} from '@/server/schema/workoutResult.schema'

interface BoxExerciseProps {
    isOwner: boolean
    exercise: WorkoutResultExerciseSchema
    previousExercise?: WorkoutResultExerciseSchema
    exerciseFromWorkoutPlan?: WorkoutPlanExercise
    setNewValues: (arg0: WorkoutResultExerciseResultSchema[]) => void
    deleteExerciseWithIndex: () => void
}

const BaseBoxExercise = ({
    exercise,
    previousExercise,
    exerciseFromWorkoutPlan,
    setNewValues,
    isOwner,
    deleteExerciseWithIndex,
}: BoxExerciseProps) => {
    const [values, setValues] = useState<WorkoutResultExerciseResultSchema[]>(
        exercise.results as WorkoutResultExerciseResultSchema[]
    )
console.log({ previousExercise })
    const changeResult = (
        object: WorkoutResultExerciseResultSchema,
        index: number
    ) => {
        let array = [...values]
        array[index] = { ...object }
        setNewValues(array)
    }

    const deleteResult = (index: number) => {
        const array = values.filter((x, i) => i != index)
        setValues(array)
        setNewValues(array)
    }

    const openNewResult = (
        lastResult: { reps: number; weight: number, rir: number } | null
    ) => {
        if (lastResult) {
            const previousValues = values.map(
                (value: WorkoutResultExerciseResultSchema) =>
                    omit(value, ['open'])
            )

            setNewValues([
                ...previousValues.slice(0, previousValues.length - 1),
                {
                    reps: lastResult.reps,
                    weight: lastResult.weight,
                    rir: lastResult.rir,
                },
                {
                    reps: lastResult.reps,
                    weight: lastResult.weight,
                    rir: lastResult.rir,
                    open: true,
                },
            ])
        } else {
            const prevRIR = previousExercise?.results?.at?.(-1)?.rir ?? 0

            setNewValues([
                {
                    reps: 0,
                    weight: 0,
                    rir: prevRIR > 0 ? prevRIR - 1 : exerciseFromWorkoutPlan?.rir ?? 0,
                    open: true,
                },
            ])
        }
    }

    useEffect(() => {
        setValues(exercise.results as WorkoutResultExerciseResultSchema[])
    }, [exercise])

    return (
        <div className="flex w-full flex-col gap-2 text-center text-sm">
            <div className="flex flex-1 flex-row items-center justify-center rounded bg-blue-300 p-2 text-white">
                <div>
                    {isOwner && (
                        <DialogConfirm onConfirmed={deleteExerciseWithIndex}>
                            <IconButton component="span">
                                <DeleteIcon sx={{ fontSize: 20 }} />
                            </IconButton>
                        </DialogConfirm>
                    )}
                </div>
                <div className="flex-1">
                    {exercise.name} ({exerciseFromWorkoutPlan?.series ?? 1}x
                    {exerciseFromWorkoutPlan?.reps ?? 1})
                </div>
                <div>{exerciseFromWorkoutPlan?.rir ?? 0} RIR</div>
            </div>
            <div>{exerciseFromWorkoutPlan?.note}</div>
            {!!previousExercise?.results?.length && (
                <div>
                    {previousExercise?.results?.map(
                        (result, index) => `${result.weight}x${result.reps}${(result.rir !== undefined ? ` (${result.rir} RIR)` : '')}`
                    ).join(', ')}
                </div>
            )}
            {values.map(
                (value: WorkoutResultExerciseResultSchema, index: number) => (
                    <BoxResult
                        key={index + ' ' + value.open}
                        value={value}
                        index={index}
                        deleteResult={() => deleteResult(index)}
                        changeResult={(object) => changeResult(object, index)}
                        isOwner={isOwner}
                        isLast={index + 1 === values.length}
                        openNewResult={openNewResult}
                    />
                )
            )}
            {isOwner && !values.length && (
                <ButtonPlusIcon
                    size="small"
                    onClick={() => openNewResult(null)}
                />
            )}
        </div>
    )
}

export default BaseBoxExercise
