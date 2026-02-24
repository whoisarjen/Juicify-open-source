import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { zodResolver } from '@hookform/resolvers/zod';
import useTranslation from 'next-translate/useTranslation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import DialogConfirm from '@/components/DialogConfirm/DialogConfirm';
import { useState, type ReactNode } from 'react'
import { type BurnedCalories } from '@prisma/client';
import { trpc } from '@/utils/trpc.utils';
import { burnedCaloriesSchema, BurnedCaloriesSchema } from '@/server/schema/burnedCalories.schema';
import InputAdornment from '@mui/material/InputAdornment';
import { pick } from 'lodash';
import TextField from '@mui/material/TextField';

interface DialogEditBurnedCaloriesProps {
    children: ReactNode
    burnedCalories: Pick<BurnedCalories, 'id' | 'name' | 'burnedCalories' | 'whenAdded'>
}

export const DialogEditBurnedCalories = ({
    children,
    burnedCalories,
}: DialogEditBurnedCaloriesProps) => {
    const { t } = useTranslation('nutrition-diary')

    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const utils = trpc.useContext()

    const deleteBurnedCalories = trpc.burnedCalories.delete.useMutation({
        onSuccess(data, variables, context) {
            utils.burnedCalories.getPeriod.refetch() // TODO
        },
    })
    const updateBurnedCalories = trpc.burnedCalories.update.useMutation({
        onSuccess(data, variables, context) {
            utils.burnedCalories.getPeriod.refetch() // TODO
        },
    })

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm<BurnedCaloriesSchema>({ resolver: zodResolver(burnedCaloriesSchema) })

    const handleUpdateConsumed = async (newBurnedCalories: BurnedCaloriesSchema) =>
        await updateBurnedCalories.mutateAsync({ ...burnedCalories, ...newBurnedCalories })
            .finally(() => setIsDialogOpen(false))

    useEffect(() => {
        if (burnedCalories) {
            reset(pick(burnedCalories, ['id', 'name', 'burnedCalories', 'whenAdded']))
        }
    }, [reset, burnedCalories])

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
                    <TextField
                        label={t('Name')}
                        sx={{ marginTop: '10px', width: '100%' }}
                        {...register('name')}
                        error={typeof errors.name === 'undefined' ? false : true}
                        helperText={errors.name?.message}
                    />
                    <TextField
                        variant="outlined"
                        label={t("Burnt")}
                        type="number"
                        sx={{ marginTop: '10px', width: '100%' }}
                        {...register('burnedCalories')}
                        error={!!errors.burnedCalories}
                        helperText={errors.burnedCalories?.message}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">kcal</InputAdornment>,
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <DialogConfirm
                        onConfirmed={async () =>
                            await deleteBurnedCalories.mutateAsync({ id: burnedCalories.id })
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
    )
}
