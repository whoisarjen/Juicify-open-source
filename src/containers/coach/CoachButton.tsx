import Button from '@mui/material/Button'

interface CoachButtonProps {
    onClick?: () => void
    variant: 'contained'
    children: string
    color?: 'error'
    disabled?: boolean
}

const CoachButton = (props: CoachButtonProps) => {
    return (
        <div className="w-full max-w-sm">
            <Button {...props} fullWidth />
        </div>
    )
}

export default CoachButton
