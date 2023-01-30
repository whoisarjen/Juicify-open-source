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
import DialogConfirm from '@/components/DialogConfirm/DialogConfirm';
import { type ConsumedSchema, consumedSchema } from '@/server/schema/consumed.schema';
import useConsumed from '@/hooks/useConsumed'
import { useState, type ReactNode } from 'react'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { range } from 'lodash';

interface DialogEditConsumedProps {
    children: ReactNode
    consumed: Consumed
}

const DialogEditConsumed = ({
    children,
    consumed,
}: DialogEditConsumedProps) => {
    const { t } = useTranslation('nutrition-diary')
    const router = useRouter()
    
    const username = router.query.login as string
    const whenAdded = router.query.date as string

    const { updateConsumed, deleteConsumed } = useConsumed({ username, startDate: whenAdded, endDate: whenAdded })
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const { data: sessionData } = useSession()

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm<ConsumedSchema>({ resolver: zodResolver(consumedSchema) })

    const handleUpdateConsumed = async (newConsumed: ConsumedSchema) =>
        await updateConsumed.mutateAsync({ ...consumed, ...newConsumed })
            .finally(() => setIsDialogOpen(false))

    useEffect(() => {
        reset({
            ...consumed,
            howMany: Number(consumed.howMany),
        })
    }, [reset, consumed])

    return (
        <form onSubmit={handleSubmit(handleUpdateConsumed)}>
            <div onClick={() => setIsDialogOpen(true)}>{children}</div>
            <Dialog
                open={isDialogOpen}
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
                        defaultValue={consumed.meal || 0}
                        {...register('meal')}
                    >
                        {range(sessionData?.user?.numberOfMeals || 0).map((x) =>
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
                        helperText={errors.howMany?.message}
                    />
                </DialogContent>
                <DialogActions>
                    <DialogConfirm
                        onConfirmed={async () =>
                            await deleteConsumed.mutateAsync({ id: consumed.id })
                                .finally(() => setIsDialogOpen(false))
                        }
                    >
                        <Button sx={{ color: 'red' }}>{t('Delete')}</Button>
                    </DialogConfirm>
                    <Button onClick={() => setIsDialogOpen(false)}>{t('Deny')}</Button>
                    <Button type="submit" onClick={handleSubmit(handleUpdateConsumed)}>{t('Confirm')}</Button>
                </DialogActions>
            </Dialog>
        </form>
    );
}

export default DialogEditConsumed;