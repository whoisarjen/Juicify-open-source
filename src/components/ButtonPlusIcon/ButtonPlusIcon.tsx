import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { ReactNode } from 'react';

interface ButtonPlusIconProps {
    onClick?: () => void
    size?: "small" | "medium" | "large"
    icon?: ReactNode
}

const ButtonPlusIcon = ({
    onClick,
    icon,
    size = 'medium',
}: ButtonPlusIconProps) => {
    return (
        <div className="flex w-full items-center justify-center" onClick={onClick}>
            <Fab size={size} color="primary" aria-label="add">
                {icon || <AddIcon />}
            </Fab>
        </div>
    );
}

export default ButtonPlusIcon;