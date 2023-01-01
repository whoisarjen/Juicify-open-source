import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SlideUp from '@/transition/SlideUp';
import { useDialogEditMacronutrientsProps } from './useDialogEditMacronutrients';
import DialogConfirm from '@/components/DialogConfirm/DialogConfirm';

const BaseDialogEditMacronutrients = ({ isOwnMacro, close, t, proteins, setProteins, carbs, setCarbs, fats, setFats, isDialog, setIsDialog, handleConfirm }: useDialogEditMacronutrientsProps) => {
    return (
        <Dialog
            open={isOwnMacro}
            TransitionComponent={SlideUp}
            keepMounted
            onClose={close}
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
                <Button onClick={close}>{t('CLOSE')}</Button>
                <DialogConfirm confirmed={handleConfirm}>
                    <Button onClick={() => setIsDialog(true)}>{t('CHANGE_ALL_DAYS')}</Button>
                </DialogConfirm>
            </DialogActions>
        </Dialog>
    )
}

export default BaseDialogEditMacronutrients;