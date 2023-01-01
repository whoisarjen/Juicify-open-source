import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import SlideUp from "@/transition/SlideUp";
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import useTranslation from 'next-translate/useTranslation';
import { setIsDialogAddProduct, setMealToAdd } from '@/redux/features/dialogAddProduct.slice';
import { useState } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';
import { useSession } from 'next-auth/react';

const DialogAddProduct = () => {
    const { t } = useTranslation('nutrition-diary')
    const { data: sessionData } = useSession()
    const dispatch = useAppDispatch()
    const [howMany, setHowMany] = useState('1.0')
    const { isDialogAddProduct, selectedProduct, mealToAdd } = useAppSelector(state => state.dialogAddProduct)
    const router: any = useRouter()

    const addNewProduct = async () => {
        // TODO
        // await createConsumed({
        //     id: uuidv4(),
        //     when: router?.query?.date || moment().format('YYYY-MM-DD'),
        //     howMany,
        //     user: sessionData?.user?.id || '',
        //     product: selectedProduct.id,
        //     meal: mealToAdd,
        // })
        // dispatch(setIsDialogAddProduct(false))
    }

    return (
        <Dialog
            open={isDialogAddProduct}
            TransitionComponent={SlideUp}
            keepMounted
            onClose={() => dispatch(setIsDialogAddProduct(false))}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>{t('ADD_TO_DIARY')}</DialogTitle>
            <DialogContent>
                <Select
                    sx={{ marginBottom: '10px' }}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={mealToAdd}
                    fullWidth
                    onChange={(e) => dispatch(setMealToAdd(e.target.value))}
                >
                    {
                        [...Array(sessionData?.user?.numberOfMeals)].map((x, i) =>
                            <MenuItem key={i} value={i}>{t('Meal')} {i + 1}</MenuItem>
                        )
                    }
                </Select>
                <TextField
                    value={howMany}
                    onChange={(e) => setHowMany(parseInt(e.target.value) > 0 ? e.target.value : '1.0')}
                    id="outlined-basic"
                    label={t('How many times 100g/ml')}
                    variant="outlined"
                    fullWidth
                    sx={{ marginTop: '12px' }}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">x 100g/ml</InputAdornment>,
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => dispatch(setIsDialogAddProduct(false))}>{t('Deny')}</Button>
                <Button onClick={addNewProduct}>{t('Confirm')}</Button>
            </DialogActions>
        </Dialog>
    )
}

export default DialogAddProduct;