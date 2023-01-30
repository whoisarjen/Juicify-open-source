import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SlideUp from '@/transition/SlideUp';
import DialogConfirm from '@/components/DialogConfirm/DialogConfirm';
import { useSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react';
import { reloadSession } from '@/utils/global.utils';
import { updateMacronutrientsInUser } from '@/utils/coach.utils';
import { trpc } from '@/utils/trpc.utils';

interface DialogEditMacronutrientsProps {
    isOwnMacro: boolean
    onClose: () => void
}

const DialogEditMacronutrients = ({
    isOwnMacro,
    onClose,
}: DialogEditMacronutrientsProps) => {
    const { data } = useSession()
    const [isDialog, setIsDialog] = useState(false) // TODO
    const [proteins, setProteins] = useState(0)
    const [carbs, setCarbs] = useState(0)
    const [fats, setFats] = useState(0)
    const { t } = useTranslation('macronutrients')

    const updateUser = trpc.user.update.useMutation({
        onSuccess() {
            onClose()
            reloadSession()
            setIsDialog(false)
        },
    })

    const handleConfirm = async () =>
        await updateUser.mutate({
            ...updateMacronutrientsInUser(
                proteins,
                carbs,
                fats,
            )
        })

    return (
        <Dialog
            open={isOwnMacro}
            TransitionComponent={SlideUp}
            keepMounted
            onClose={onClose}
        >
            <DialogTitle>{t('BUTTON')}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    {t('OWN_MACRO_DESCRIPTION')}
                </DialogContentText>
                <TextField
                    fullWidth
                    sx={{ marginTop: '5px' }}
                    id="outlined-basic"
                    label={t('PROTEINS')}
                    value={proteins}
                    onChange={(e) => setProteins(parseInt(e.target.value.toString()))}
                    variant="outlined"
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    InputProps={{
                        endAdornment: <InputAdornment position="start">g/day</InputAdornment>,
                    }}
                />
                <TextField
                    fullWidth
                    sx={{ marginTop: '5px' }}
                    id="outlined-basic"
                    label={t('CARBS')}
                    value={carbs}
                    onChange={(e) => setCarbs(parseInt(e.target.value.toString()))}
                    variant="outlined"
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    InputProps={{
                        endAdornment: <InputAdornment position="start">g/day</InputAdornment>,
                    }}
                />
                <TextField
                    fullWidth
                    sx={{ marginTop: '5px' }}
                    id="outlined-basic"
                    label={t('FATS')}
                    value={fats}
                    onChange={(e) => setFats(parseInt(e.target.value.toString()))}
                    variant="outlined"
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    InputProps={{
                        endAdornment: <InputAdornment position="start">g/day</InputAdornment>,
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>{t('CLOSE')}</Button>
                <DialogConfirm onConfirmed={handleConfirm}>
                    <Button onClick={() => setIsDialog(true)}>{t('CHANGE_ALL_DAYS')}</Button>
                </DialogConfirm>
            </DialogActions>
        </Dialog>
    )
}

export default DialogEditMacronutrients;