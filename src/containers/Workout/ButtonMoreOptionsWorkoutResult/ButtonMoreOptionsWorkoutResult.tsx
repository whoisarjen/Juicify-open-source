import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
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

    const actions = [
        {
            icon: <DialogAddExercises
                skipThoseIDS={exercises}
                addThoseExercises={handleAddThoseExercises}
            ><FitnessCenterIcon /></DialogAddExercises>,
            name: 'Exercise',
            click: () => undefined
        },
    ];

    return (
        <div className="fixed bottom-12 w-full max-w-3xl left-1/2 -translate-x-2/4 z-10">
            <SpeedDial
                data-testid="ButtonMoreOptionsWorkoutResult"
                ariaLabel="Manage result"
                sx={{ position: 'absolute', bottom: 44, left: 16, }}
                icon={<SpeedDialIcon />}
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                open={open}
            >
                {actions.map((action) => (
                    <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                        tooltipPlacement="right"
                        tooltipOpen
                        onClick={action.click}
                    />
                ))}
            </SpeedDial>
        </div>
    );
}

export default ButtonMoreOptionsWorkoutResult;