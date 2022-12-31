import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import styled from 'styled-components'
import { ReactNode } from 'react';

const Button = styled.div`
    width: 100%;
    display: grid;
    margin-top: 10px;
    ${this} button {
        margin: auto;
    }
`

interface ButtonPlusIconProps {
    click?: () => void
    size?: "small" | "medium" | "large" | undefined
    icon?: ReactNode
}

const ButtonPlusIcon = ({ click, icon, size = 'medium' }: ButtonPlusIconProps) => {
    return (
        <Button onClick={click} data-testid="ButtonPlusIcon">
            <Fab size={size} color="primary" aria-label="add">
                {icon || <AddIcon />}
            </Fab>
        </Button>
    );
}

export default ButtonPlusIcon;