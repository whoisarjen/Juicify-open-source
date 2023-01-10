import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { useState } from 'react';
import DialogAddExercises from '@/containers/DialogAddExercises/DialogAddExercises';
import styled from 'styled-components';

export interface ButtonMoreOptionsWorkoutResultProps {
    exercises: (WorkoutPlanExercise | WorkoutResultExercise)[],
    setExercises: (exercises: (WorkoutPlanExercise | WorkoutResultExercise)[]) => void
}

const Box = styled.div`
    width: 100%;
    max-width: 702px;
    position: fixed;
    bottom: var(--BothNavHeightAndPadding);
    left: 50%;
    transform: translate(-50%, 0);
    height: 100px;
`

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
        <Box>
            <SpeedDial
                data-testid="ButtonMoreOptionsWorkoutResult"
                ariaLabel="Manage result"
                sx={{ position: 'absolute', bottom: 22, left: 16, }}
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
        </Box>
    );
}

export default ButtonMoreOptionsWorkoutResult;