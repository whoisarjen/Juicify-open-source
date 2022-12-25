import SaveIcon from '@mui/icons-material/Save'
import IconButton from '@mui/material/IconButton'
import LoadingButton from '@mui/lab/LoadingButton'
import DeleteIcon from '@mui/icons-material/Delete'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import styled from 'styled-components'
import DialogConfirm from '@/components/DialogConfirm/DialogConfirm'
import { useAppSelector } from '@/hooks/useRedux'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'

const Grid = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: 44px 1fr 44px auto;
    margin: auto;
`

interface NavbarWorkoutProp {
    isLoading: boolean
    onSave: () => void
    onDelete: () => void
    onArrowBack: () => void
}

const NavbarWorkout = ({
    onArrowBack,
    isLoading,
    onSave,
    onDelete,
}: NavbarWorkoutProp) => {
    const router = useRouter()
    const { t } = useTranslation('workout')
    const token = useAppSelector(state => state.token)

    return (
        <Grid>
            <IconButton aria-label="route" onClick={onArrowBack} sx={{ margin: 'auto' }}>
                <KeyboardBackspaceIcon />
            </IconButton>
            <div />
            {token.username == router.query.login
                ? <>
                    <DialogConfirm confirmed={onDelete}>
                        <IconButton aria-label="delete" sx={{ margin: 'auto' }}>
                            <DeleteIcon />
                        </IconButton>
                    </DialogConfirm>
                    <LoadingButton
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
        </Grid>
    );
}

export default NavbarWorkout;