import SaveIcon from '@mui/icons-material/Save'
import IconButton from '@mui/material/IconButton'
import LoadingButton from '@mui/lab/LoadingButton'
import DeleteIcon from '@mui/icons-material/Delete'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import DialogConfirm from '@/components/DialogConfirm/DialogConfirm'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

interface NavbarWorkoutProp {
    isDisabled: boolean
    isLoading: boolean
    onSave: () => void
    onDelete: () => void
    onArrowBack: () => void
}

const NavbarWorkout = ({
    isDisabled,
    onArrowBack,
    isLoading,
    onSave,
    onDelete,
}: NavbarWorkoutProp) => {
    const router = useRouter()
    const { t } = useTranslation('workout')
    const { data: sessionData } = useSession()

    return (
        <div className="flex w-full">
            <IconButton aria-label="route" onClick={onArrowBack} sx={{ margin: 'auto' }}>
                <KeyboardBackspaceIcon />
            </IconButton>
            <div className="flex-1" />
            {sessionData?.user?.username == router.query.login
                ? <>
                    <DialogConfirm onConfirmed={onDelete} isDisabled={isDisabled}>
                        <IconButton disabled={isDisabled} aria-label="delete" sx={{ margin: 'auto' }}>
                            <DeleteIcon />
                        </IconButton>
                    </DialogConfirm>
                    <LoadingButton
                        disabled={isDisabled}
                        loading={isLoading}
                        loadingPosition="start"
                        startIcon={<SaveIcon />}
                        variant="outlined"
                        onClick={onSave}
                    >
                        {t('Save')}
                    </LoadingButton>
                </>
                : <>
                    <div />
                    <div />
                </>
            }
        </div>
    );
}

export default NavbarWorkout;