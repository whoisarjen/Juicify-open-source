import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { zodResolver } from '@hookform/resolvers/zod';
import useTranslation from 'next-translate/useTranslation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { setIsDialogEditConsumed } from '@/redux/features/dialogEditConsumed.slice';
import DialogConfirm from '@/components/DialogConfirm/DialogConfirm';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { type ConsumedSchema, consumedSchema } from '@/server/schema/consumed.schema';
import useConsumed from '@/hooks/useConsumed';

const DialogEditConsumed = () => {
    const dispatch = useAppDispatch()
    const { t } = useTranslation('nutrition-diary')
    const { isDialogEditConsumed, selectedConsumed } = useAppSelector(state => state.dialogEditConsumed)
    const { updateConsumed, deleteConsumed, user } = useConsumed()

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm<ConsumedSchema>({ resolver: zodResolver(consumedSchema) })

    const handleUpdateConsumed = async (newConsumed: ConsumedSchema) =>
        await updateConsumed.mutateAsync({ ...selectedConsumed, ...newConsumed })

    useEffect(() => {
        reset(selectedConsumed)
    }, [reset, selectedConsumed])

    return (
        <form onSubmit={handleSubmit(handleUpdateConsumed)}>
            <Dialog
                open={isDialogEditConsumed}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {t('Edit')}
                </DialogTitle>
                <DialogContent>
                    <Select
                        sx={{ width: '100%' }}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        defaultValue={selectedConsumed.meal || 0}
                        {...register('meal')}
                    >
                        {Array.from(Array(user?.numberOfMeals).keys()).map((x) =>
                            <MenuItem key={x} value={x}>{t('Meal')} {x + 1}</MenuItem>
                        )}
                    </Select>
                    <TextField
                        type="number"
                        label={t('How many times 100g/ml')}
                        sx={{ marginTop: '10px', width: '100%' }}
                        {...register('howMany')}
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        error={typeof errors.howMany === 'undefined' ? false : true}
                        helperText={errors.howMany?.message && t(`notify:${errors.howMany.message || ''}`)}
                    />
                </DialogContent>
                <DialogActions>
                    <DialogConfirm confirmed={async () => await deleteConsumed.mutateAsync({ id: selectedConsumed.id })}>
                        <Button sx={{ color: 'red' }}>{t('Delete')}</Button>
                    </DialogConfirm>
                    <Button onClick={() => dispatch(setIsDialogEditConsumed(false))}>{t('Deny')}</Button>
                    <Button type="submit" onClick={handleSubmit(handleUpdateConsumed)}>{t('Confirm')}</Button>
                </DialogActions>
            </Dialog>
        </form>
    );
}

export default DialogEditConsumed;