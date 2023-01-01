import useTranslation from "next-translate/useTranslation"
import { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import ButtonPlusIcon from "@/components/ButtonPlusIcon/ButtonPlusIcon";
import { DatePicker } from '@/components/DatePicker'
import moment from 'moment'
import { type CreateMeasurementSchema, createMeasurementSchema } from "@/server/schema/measurement.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import InputAdornment from '@mui/material/InputAdornment';
import { trpc } from "@/utils/trpc"
import { sortBy } from 'lodash'
import { useSession } from "next-auth/react"

export const DialogMeasurement = () => {
    const [whenAdded, setWhenAdded] = useState(moment().toDate())
    const [open, setOpen] = useState(false)
    const { t } = useTranslation('home')
    const { data: sessionData } = useSession()

    const utils = trpc.useContext()
    const username = sessionData?.user?.username || ''

    // TODO remove option
    // TODO update option

    const createMeasurement = trpc.measurement.create.useMutation({
        onSuccess(data, variables, context) {
            handleClose()

            // TODO check if newer on today day

            utils
                .measurement
                .getAll
                .setData({ username }, currentData =>
                    sortBy([...(currentData || []), data], ['id', 'whenAdded']))
        },
    })

    const {
        register,
        formState: { errors },
        handleSubmit,
        control,
        reset,
        setValue
    } = useForm<CreateMeasurementSchema>({ resolver: zodResolver(createMeasurementSchema) })

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const onWhenChange = (newWhenAdded: Date) => {
        setWhenAdded(newWhenAdded)
        setValue('whenAdded', moment(newWhenAdded).toDate())
    }

    const handleCreateMeasurement = async (newMeasurement: CreateMeasurementSchema) =>
        await createMeasurement.mutateAsync(newMeasurement)

    useEffect(() => {
        setValue('whenAdded', whenAdded)
    }, [setValue, whenAdded])

    return (
        <form onSubmit={handleSubmit(handleCreateMeasurement)}>
            <ButtonPlusIcon onClick={handleClickOpen} />
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{t('home:ADD_WEIGHT')}</DialogTitle>
                <DialogContent>
                    <DatePicker
                        when={whenAdded}
                        onChange={onWhenChange}
                        sx={{ marginTop: '8px' }}
                        register={register('whenAdded')}
                    />
                    <TextField
                        fullWidth
                        type="number"
                        margin="dense"
                        label="Weight"
                        variant="outlined"
                        {...register('weight')}
                        error={!!errors.weight}
                        helperText={errors.weight?.message && t(`notify:${errors.weight.message || ''}`)}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>{t('deny')}</Button>
                    <Button onClick={handleSubmit(handleCreateMeasurement)}>{t('accept')}</Button>
                </DialogActions>
            </Dialog>
        </form>
    )
}
