import { Save, Trash2, ArrowLeft } from 'lucide-react'
import IconButton from '@mui/material/IconButton'
import LoadingButton from '@mui/lab/LoadingButton'
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
                <ArrowLeft />
            </IconButton>
            <div className="flex-1" />
            {sessionData?.user?.username == router.query.login
                ? <>
                    <DialogConfirm onConfirmed={onDelete} isDisabled={isDisabled}>
                        <IconButton disabled={isDisabled} aria-label="delete" sx={{ margin: 'auto' }}>
                            <Trash2 />
                        </IconButton>
                    </DialogConfirm>
                    <LoadingButton
                        disabled={isDisabled}
                        loading={isLoading}
                        loadingPosition="start"
                        startIcon={<Save />}
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