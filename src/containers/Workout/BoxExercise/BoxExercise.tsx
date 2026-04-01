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
        <div className="flex w-full flex-col gap-1 text-center text-xs win2k-window">
            {/* Win2k panel header / title bar */}
            <div className="win2k-titlebar px-2 py-1 flex items-center gap-2">
                {isOwner && (
                    <DialogConfirm onConfirmed={deleteExerciseWithIndex}>
                        <button className="win2k-btn !px-1 !py-0 !min-h-0 h-[16px] text-[10px] flex items-center justify-center text-black" aria-label="delete exercise">
                            <Trash2 size={10} />
                        </button>
                    </DialogConfirm>
                )}
                <div className="flex-1 text-left font-bold text-white text-[11px]">
                    {exercise.name} ({exerciseFromWorkoutPlan?.series ?? 1}x
                    {exerciseFromWorkoutPlan?.reps ?? 1})
                </div>
                <div className="text-white text-[10px]">{exerciseFromWorkoutPlan?.rir ?? 0} RIR</div>
            </div>

            <div className="px-2 pb-1">
                {exerciseFromWorkoutPlan?.note && (
                    <div className="text-[10px] text-[#444444] text-left py-1">{exerciseFromWorkoutPlan.note}</div>
                )}
                {!!previousExercise?.results?.length && (
                    <div className="flex flex-col gap-1 opacity-50 mb-1">
                        {previousExercise.results.map((result, index) => (
                            <div key={index} className="flex flex-row p-1 items-center justify-center border border-dashed border-[#808080] bg-[#e8e4d8]">
                                <div className="flex-1 text-[10px]">{result.weight}kg</div>
                                <div className="flex-1 text-[10px]">#{index + 1}</div>
                                <div className="flex-1 text-[10px]">{result.reps}r.</div>
                                <div className="flex-1 text-[10px]">{result.rir ?? 0} RIR</div>
                            </div>
                        ))}
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
                            previousSetAt={index > 0 ? values[index - 1]?.setAt : undefined}
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
        </div>
    )
}

export default BaseBoxExercise
