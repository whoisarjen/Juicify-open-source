import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import useTranslation from "next-translate/useTranslation"
import DialogContentText from '@mui/material/DialogContentText'
import { useState } from 'react'

interface DialogConfirmProps {
    children: any
    onConfirmed: () => void
    isDisabled?: boolean
}

const DialogConfirm = ({
    children,
    onConfirmed,
    isDisabled,
}: DialogConfirmProps) => {
    const [isDialog, setIsDialog] = useState(false)
    const { t } = useTranslation('home')

    const handleSetIsDialog = (event: any, state: boolean) => {
        event?.stopPropagation()
        setIsDialog(state)
    }

    const handleConfimed = (event: any) => {
        onConfirmed()
        handleSetIsDialog(event, false)
    }

    return (
        <>
            <div onClick={event => handleSetIsDialog(event, true)}>{children}</div>
            <Dialog
                open={!isDisabled && isDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {t('Confirm Dialog Title')}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {t('This action can NOT be undone')}.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={event => handleSetIsDialog(event, false)}>{t('Deny')}</Button>
                    <LoadingButton
                        onClick={handleConfimed}
                        autoFocus
                    >
                        {t('Confirm')}
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default DialogConfirm
