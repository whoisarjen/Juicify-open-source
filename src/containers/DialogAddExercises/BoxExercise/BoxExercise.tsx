import Checkbox from '@mui/material/Checkbox'
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
            <Checkbox
                data-testid="checkBox"
                checked={isChecked}
                onClick={() => onCheck(!isChecked, exercise)}
                inputProps={{ 'aria-label': 'controlled' }}
            />
        </div>
    )
}

export default BoxExercise
