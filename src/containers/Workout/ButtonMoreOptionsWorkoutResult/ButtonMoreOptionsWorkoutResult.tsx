import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { useState } from 'react';
import DialogAddExercises from '@/containers/DialogAddExercises/DialogAddExercises';

export interface ButtonMoreOptionsWorkoutResultProps {
    exercises: (WorkoutPlanExercise | WorkoutResultExercise)[],
    setExercises: (exercises: (WorkoutPlanExercise | WorkoutResultExercise)[]) => void
}

const ButtonMoreOptionsWorkoutResult = ({ exercises, setExercises }: ButtonMoreOptionsWorkoutResultProps) => {
    const [open, setOpen] = useState(false);

    const handleAddThoseExercises = (selectedExercises: (WorkoutPlanExercise | WorkoutResultExercise)[]) => {
        setOpen(false)
        setExercises(selectedExercises)
    }

    return (
        <div className="fixed bottom-12 w-full max-w-3xl left-1/2 -translate-x-2/4 z-10">
            <div className="absolute bottom-11 left-4 flex flex-col-reverse items-center gap-2">
                {open && (
                    <div className="flex flex-col-reverse items-center gap-2">
                        <DialogAddExercises
                            skipThoseIDS={exercises}
                            addThoseExercises={handleAddThoseExercises}
                        >
                            <button
                                type="button"
                                className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-600 text-white shadow-lg hover:bg-gray-500"
                                title="Exercise"
                            >
                                <FitnessCenterIcon />
                            </button>
                        </DialogAddExercises>
                    </div>
                )}
                <button
                    type="button"
                    data-testid="ButtonMoreOptionsWorkoutResult"
                    aria-label="Manage result"
                    onClick={() => setOpen(!open)}
                    className={`flex h-14 w-14 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg transition-transform hover:bg-blue-600 ${open ? 'rotate-45' : ''}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default ButtonMoreOptionsWorkoutResult;
