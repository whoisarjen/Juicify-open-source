import { Dumbbell } from 'lucide-react';
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
        <div className="fixed bottom-8 right-8 z-40 flex flex-col-reverse items-center gap-2">
            {open && (
                <DialogAddExercises
                    skipThoseIDS={exercises}
                    addThoseExercises={handleAddThoseExercises}
                >
                    <button
                        type="button"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(255,255,255,0.06)] text-primary-dark shadow-lg hover:bg-[rgba(255,255,255,0.10)] cursor-pointer"
                        title="Exercise"
                    >
                        <Dumbbell size={18} />
                    </button>
                </DialogAddExercises>
            )}
            <button
                type="button"
                data-testid="ButtonMoreOptionsWorkoutResult"
                aria-label="Manage result"
                onClick={() => setOpen(!open)}
                className={`flex h-12 w-12 items-center justify-center rounded-full bg-primary-dark text-[#121212] shadow-lg transition-all hover:bg-[#64b5f6] cursor-pointer ${open ? 'rotate-45' : ''}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
            </button>
        </div>
    );
}

export default ButtonMoreOptionsWorkoutResult;
