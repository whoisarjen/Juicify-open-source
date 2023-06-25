import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { zodResolver } from '@hookform/resolvers/zod';
import useTranslation from 'next-translate/useTranslation';
import { useForm } from 'react-hook-form';
import { useEffect, useState, type ReactNode } from 'react'
import { trpc } from '@/utils/trpc.utils';
import { createBurnedCaloriesSchema, CreateBurnedCaloriesSchema } from '@/server/schema/burnedCalories.schema';
import { useRouter } from 'next/router';
import moment from 'moment';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';

interface DialogAddBurnedCaloriesProps {
    children: ReactNode
}

export const DialogAddBurnedCalories = ({
    children,
}: DialogAddBurnedCaloriesProps) => {
    const { t } = useTranslation('nutrition-diary')
    const router = useRouter()

    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const utils = trpc.useContext()

    const createBurnedCalories = trpc.burnedCalories.create.useMutation({
        onSuccess() {
            utils.burnedCalories.getPeriod.refetch() // TODO
        },
    })

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm<CreateBurnedCaloriesSchema>({ resolver: zodResolver(createBurnedCaloriesSchema) })

    const handleCreateBurnedCalories = async (newBurnedCalories: CreateBurnedCaloriesSchema) =>
        await createBurnedCalories.mutateAsync(newBurnedCalories)
            .finally(() => setIsDialogOpen(false))

    useEffect(() => {
        reset({ whenAdded: moment(router.query.date).add(moment().format("hh:mm:ss")).toDate(), burnedCalories: 0, name: 'Cardio' })
    }, [reset, router.query.date])

    return (
        <>
            <div onClick={() => setIsDialogOpen(true)}>{children}</div>
            <Dialog
                open={isDialogOpen}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <form onSubmit={handleSubmit(handleCreateBurnedCalories)}>
                    <DialogTitle id="alert-dialog-title">
                        {t('Add')}
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
                        <Button onClick={() => setIsDialogOpen(false)}>{t('Deny')}</Button>
                        <Button type="submit" onClick={handleSubmit(handleCreateBurnedCalories)}>{t('Confirm')}</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    )
}
