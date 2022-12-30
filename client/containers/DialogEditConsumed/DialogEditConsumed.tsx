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
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { setIsDialogEditConsumed } from '@/redux/features/dialogEditConsumed.slice';
import { useUpdateConsumedMutation } from '@/generated/graphql';
import DialogConfirm from '@/components/DialogConfirm/DialogConfirm';
import { useSession } from 'next-auth/react';
import { trpc } from '@/utils/trpc';
import { type ConsumedSchema, consumedSchema } from '@/server/schema/consumed.schema';
import { useRouter } from 'next/router';
import moment from 'moment';

const DialogEditConsumed = () => {
    const dispatch = useAppDispatch()
    const { t } = useTranslation('nutrition-diary');
    const { data: sessionData } = useSession()
    const { isDialogEditConsumed, selectedConsumed } = useAppSelector(state => state.dialogEditConsumed)
    const [, updateConsumed] = useUpdateConsumedMutation()

    const router: any = useRouter()

    const username = router.query.login
    const whenAdded = moment(router.query.date).toDate()

    const utils = trpc.useContext()

    const deleteConsumed = trpc.consumed.delete.useMutation({
        onSuccess(data, variables) {
            dispatch(setIsDialogEditConsumed(false))

            utils
                .consumed
                .getDay
                .setData({ username, whenAdded }, currentData => currentData?.filter(consumed => consumed.id !== variables.id))
        }
    })

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm<ConsumedSchema>({ resolver: zodResolver(consumedSchema) })

    const handleUpdateConsumed = (newConsumed: ConsumedSchema) => {
        updateConsumed({ ...selectedConsumed, ...newConsumed })
        dispatch(setIsDialogEditConsumed(false))
    }

    useEffect(() => reset(selectedConsumed), [reset, selectedConsumed])

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
                {
                    <DialogContent>
                        <Select
                            sx={{ width: '100%' }}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            defaultValue={selectedConsumed.meal || 0}
                            {...register('meal')}
                        >
                            {Array.from(Array(sessionData?.user?.numberOfMeals).keys()).map((x) =>
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
                }
                <DialogActions>
                    <DialogConfirm confirmed={async () => await deleteConsumed.mutate({ id: selectedConsumed.id })}>
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