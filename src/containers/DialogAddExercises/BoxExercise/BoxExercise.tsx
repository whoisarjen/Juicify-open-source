import { Exercise } from '@prisma/client'

interface BoxExerciseProps {
    exercise: Exercise
    isChecked: boolean
    onCheck: (state: boolean, exercise: Exercise) => void
}

const BoxExercise = ({ exercise, isChecked, onCheck }: BoxExerciseProps) => {
    return (
        <div className="flex items-center rounded border p-3 text-sm">
            <div className="flex-1 font-bold text-primary-dark">
                {exercise.name}
            </div>
            <input
                data-testid="checkBox"
                type="checkbox"
                checked={isChecked}
                onChange={() => onCheck(!isChecked, exercise)}
                aria-label="controlled"
                className="h-5 w-5 accent-blue-500"
            />
        </div>
    )
}

export default BoxExercise
