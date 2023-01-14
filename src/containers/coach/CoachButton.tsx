import styled from 'styled-components'
import Button from '@mui/material/Button';

const ButtonWrapper = styled.div`
    width: 100%;
    max-width: 305px;
    padding: 0 12px;
    border-size: border-box;
`

interface CoachButtonProps {
    onClick?: () => void
    variant: 'contained'
    children: string
    color?: 'error'
    disabled?: boolean
}

const CoachButton = (props: CoachButtonProps) => {
    return (
        <ButtonWrapper>
            <Button {...props} fullWidth />
        </ButtonWrapper>
    )
}

export default CoachButton