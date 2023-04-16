import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import LoadingButton from '@mui/lab/LoadingButton'
import InputAdornment from '@mui/material/InputAdornment'
import useTranslation from 'next-translate/useTranslation'
import { useState, useEffect, ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import {
    type CreateProductSchema,
    createProductSchema,
} from '@/server/schema/product.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { trpc } from '@/utils/trpc.utils'

interface DialogCreateProductProps {
    children?: ReactNode
    created: (name: string) => void
    barcode?: string
    defaultState?: boolean
}

const DialogCreateProduct = ({
    children,
    created,
    barcode,
    defaultState = false,
}: DialogCreateProductProps) => {
    const { t } = useTranslation('nutrition-diary')
    const [isDialog, setIsDialog] = useState(defaultState)
    const createProduct = trpc.product.create.useMutation({
        onSuccess(_, variables) {
            created(variables.name)
            setIsDialog(false)
        },
    })

    const {
        register,
        formState: { errors },
        handleSubmit,
        setValue,
    } = useForm<CreateProductSchema>({
        resolver: zodResolver(createProductSchema),
    })

    const onSubmit = async (newProduct: CreateProductSchema) =>
        await createProduct.mutate(newProduct)

    useEffect(() => {
        setValue('barcode', Number(barcode) as unknown as string)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [barcode])

    return (
        <>
            {children && (
                <div className="flex" onClick={() => setIsDialog(true)}>
                    {children}
                </div>
            )}
            <Dialog open={isDialog}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogTitle>{t('Create product')}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {t('Create product description')}
                        </DialogContentText>
                        <TextField
                            type="text"
                            fullWidth
                            variant="standard"
                            label={t('Name of product')}
                            {...register('name')}
                            error={
                                typeof errors.name === 'undefined'
                                    ? false
                                    : true
                            }
                            helperText={errors.name?.message}
                        />
                        <TextField
                            sx={{ marginTop: '12px' }}
                            type="number"
                            inputProps={{
                                inputMode: 'numeric',
                                pattern: '[0-9]*',
                            }}
                            fullWidth
                            variant="standard"
                            label="Barcode"
                            {...register('barcode')}
                            error={!!errors.barcode}
                            helperText={errors.barcode?.message}
                        />
                        <TextField
                            sx={{ marginTop: '12px' }}
                            fullWidth
                            variant="standard"
                            label={t('Proteins')}
                            {...register('proteins')}
                            error={!!errors.proteins}
                            helperText={errors.proteins?.message}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {t('g in 100g/ml')}
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            sx={{ marginTop: '12px' }}
                            fullWidth
                            variant="standard"
                            label={t('Carbs')}
                            {...register('carbs')}
                            error={!!errors.carbs}
                            helperText={errors.carbs?.message}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {t('g in 100g/ml')}
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            sx={{ marginTop: '12px' }}
                            fullWidth
                            variant="standard"
                            label={t('Sugar')}
                            {...register('sugar')}
                            error={!!errors.sugar}
                            helperText={errors.sugar?.message}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {t('g in 100g/ml')}
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            sx={{ marginTop: '12px' }}
                            fullWidth
                            variant="standard"
                            label={t('Fats')}
                            {...register('fats')}
                            error={!!errors.fats}
                            helperText={errors.fats?.message}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {t('g in 100g/ml')}
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            sx={{ marginTop: '12px' }}
                            fullWidth
                            variant="standard"
                            label={t('Fiber')}
                            {...register('fiber')}
                            error={!!errors.fiber}
                            helperText={errors.fiber?.message}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {t('g in 100g/ml')}
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            sx={{ marginTop: '12px' }}
                            fullWidth
                            variant="standard"
                            label={t('Salt')}
                            {...register('sodium')}
                            error={!!errors.sodium}
                            helperText={errors.sodium?.message}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {t('g in 100g/ml')}
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            sx={{ marginTop: '12px' }}
                            fullWidth
                            variant="standard"
                            label={t('Ethanol')}
                            {...register('ethanol')}
                            error={!!errors.ethanol}
                            helperText={errors.ethanol?.message}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {t('g in 100g/ml')}
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <FormControlLabel
                            control={
                                <Switch {...register('isExpectingCheck')} />
                            }
                            label={t('Should be available for all?')}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setIsDialog(false)}>
                            {t('Cancel')}
                        </Button>
                        <LoadingButton
                            loading={createProduct.isLoading}
                            variant="contained"
                            type="submit"
                        >
                            {t('Submit')}
                        </LoadingButton>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    )
}

export default DialogCreateProduct
