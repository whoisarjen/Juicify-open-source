import { Trash2 } from 'lucide-react'
import DialogConfirm from '@/components/DialogConfirm/DialogConfirm'
import { useState, useEffect } from 'react'
import BoxResult from '../BoxResult/BoxResult'
import ButtonPlusIcon from '@/components/ButtonPlusIcon/ButtonPlusIcon'
import { omit } from 'lodash-es'
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
        const setAt = new Date().toISOString()
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

        if (lastResult) {
            const previousValues = values.map(
                (value: WorkoutResultExerciseResultSchema) =>
                    omit(value, ['open'])
            )

            setNewValues([
                ...previousValues.slice(0, previousValues.length - 1),
                {
                    ...previousValues[previousValues.length - 1],
                    reps: lastResult.reps,
                    weight: lastResult.weight,
                    rir: lastResult.rir,
                },
                {
                    reps: lastResult.reps,
                    weight: lastResult.weight,
                    rir: lastResult.rir,
                    open: true,
                    setAt,
                    timezone,
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
                    setAt,
                    timezone,
                },
            ])
        }
    }

    useEffect(() => {
        setValues(exercise.results as WorkoutResultExerciseResultSchema[])
    }, [exercise])

    return (
        <div className="flex w-full flex-col gap-2 text-center text-sm">
            <div className="flex flex-1 flex-row items-center justify-center rounded bg-primary-dark p-2 text-[#121212]">
                <div>
                    {isOwner && (
                        <DialogConfirm onConfirmed={deleteExerciseWithIndex}>
                            <button className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                                <Trash2 size={20} />
                            </button>
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
                <div className="flex flex-col gap-1 opacity-50">
                    {previousExercise.results.map((result, index) => (
                        <div key={index} className="flex flex-row border border-dashed p-2 rounded items-center justify-center overflow-hidden">
                            <div className="min-w-0 flex-1 truncate">{result.weight}kg</div>
                            <div className="min-w-0 flex-1 truncate">#{index + 1}</div>
                            <div className="min-w-0 flex-1 truncate">{result.reps}r.</div>
                            <div className="min-w-0 flex-1 truncate">{result.rir ?? 0} RIR</div>
                        </div>
                    ))}
                </div>
            )}
            {values.map(
                (value: WorkoutResultExerciseResultSchema, index: number) => (
                    <BoxResult
                        key={index}
                        value={value}
                        index={index}
                        deleteResult={() => deleteResult(index)}
                        changeResult={(object) => changeResult(object, index)}
                        isOwner={isOwner}
                        isLast={index + 1 === values.length}
                        openNewResult={openNewResult}
                        previousSetAt={index > 0 ? values[index - 1]?.setAt ?? undefined : undefined}
                    />
                )
            )}
            {isOwner && !values.length && (
                <ButtonPlusIcon
                    size="small"
                    variant="inline"
                    onClick={() => openNewResult(null)}
                />
            )}
        </div>
    )
}

export default BaseBoxExercise
