import { useTheme } from '@/hooks/useTheme';
import Checkbox from '@mui/material/Checkbox';
import { Exercise } from '@prisma/client';
import styled from 'styled-components';

const Box = styled.div`
    display: grid;
    grid-template-columns: 1fr 44px 44px;
    margin-bottom: 10px;
    border: 1px solid #e4e4e4;
    border-left: 5px solid #e4e4e4;
    border-radius: 8px;
    padding: 10px 5px 10px 15px;
    width: calc(100% - 26px);
    font-size: 0.875rem;
    ${this} div {
        margin: auto;
    }
`

const Name = styled.div`
    margin-left: 0 !important;
    font-weight: bold;
`

interface BoxExerciseProps {
    exercise: Exercise
    isChecked: boolean
    onCheck: (state: boolean) => void
}

const BoxExercise = ({ exercise, isChecked, onCheck }: BoxExerciseProps) => {
    const { getTheme } = useTheme()

    return (
        <Box>
            <Name style={{ color: getTheme('PRIMARY') }}>
                {exercise.name}
            </Name>
            <div />
            <div onChange={() => onCheck(!isChecked)}>
                <Checkbox
                    data-testid="checkBox"
                    checked={isChecked}
                    inputProps={{ 'aria-label': 'controlled' }}
                />
            </div>
        </Box>
    );
}

export default BoxExercise;