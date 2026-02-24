import useTranslation from "next-translate/useTranslation"
import { useEffect, useState, type ReactNode } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import ButtonPlusIcon from "@/components/ButtonPlusIcon/ButtonPlusIcon";
import { DatePicker } from '@/components/DatePicker'
import moment from 'moment'
import {
    measurementSchema,
    type MeasurementSchema,
    createMeasurementSchema,
    type CreateMeasurementSchema,
} from "@/server/schema/measurement.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import InputAdornment from '@mui/material/InputAdornment';
import { trpc } from "@/utils/trpc.utils"
import { orderBy } from 'lodash'
import { useSession } from "next-auth/react"
import DialogConfirm from "@/components/DialogConfirm/DialogConfirm"
import { updateArray } from '@/utils/global.utils'

interface DialogMeasurementProps {
    measurement: Measurement | null
    defaultWeight?: number
}

const today = moment().format('YYYY-MM-DD')

export const DialogMeasurement = ({
    measurement,
    defaultWeight = 0,
}: DialogMeasurementProps) => {
    const [open, setOpen] = useState(false)
    const { t } = useTranslation('home')
    const { data: sessionData } = useSession()

    const {
        register,
        formState: { errors },
        handleSubmit,
        control,
        reset,
        setValue,
        getValues,
    } = useForm<CreateMeasurementSchema | MeasurementSchema>({
        resolver: zodResolver(measurement
            ? measurementSchema
            : createMeasurementSchema
        )
    })

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
        reset({ whenAdded: moment().toDate(), weight: defaultWeight })
    }

    const utils = trpc.useContext()
    const username = sessionData?.user?.username || ''

    const createMeasurement = trpc.measurement.create.useMutation({
        onSuccess(data, variables, context) {
            handleClose()

            utils
                .measurement
                .getDay
                .setData({ username, whenAdded: today }, currentData => {
                    if (moment(data.whenAdded).format('YYYY-MM-DD') === today) {
                        if (!currentData) {
                            return data
                        }

                        if (currentData.whenAdded < data.whenAdded) {
                            return data
                        }
                    }

                    return currentData
                })

            utils
                .measurement
                .getAll
                .setData({ username }, currentData =>
                    orderBy(
                        [...(currentData || []), data],
                        ['id', 'whenAdded'],
                        ['desc', 'desc']
                    )
                )
        },
    })

    const updateMeasurement = trpc.measurement.update.useMutation({
        onSuccess(data, variables, context) {
            handleClose()

            utils
                .measurement
                .getDay
                .setData({ username, whenAdded: today }, currentData => {
                    if (currentData?.id === data.id) {
                        return {
                            ...currentData,
                            data,
                        }
                    }

                    return currentData
                })

            utils
                .measurement
                .getAll
                .setData({ username }, currentData =>
                    orderBy(
                        updateArray(currentData, data),
                        ['id', 'whenAdded'],
                        ['desc', 'desc']
                    )
                )
        },
    })

    const deleteMeasurement = trpc.measurement.delete.useMutation({
        onSuccess(data, variables, context) {
            handleClose()

            utils
                .measurement
                .getDay
                .setData({ username, whenAdded: today }, currentData => {
                    if (currentData?.id === data.id) {
                        return null
                    }

                    return currentData
                })

            utils
                .measurement
                .getAll
                .setData({ username }, currentData =>
                    orderBy(
                        (currentData || []).filter(measurement => measurement.id !== variables.id),
                        ['id', 'whenAdded'],
                        ['desc', 'desc']
                    )
                )
        },
    })

    const handleSubmitProxy = () => {
        if (measurement) {
            return handleSubmit(async (newMeasurement) =>
                await updateMeasurement.mutateAsync(newMeasurement as unknown as MeasurementSchema))
        }

        return handleSubmit(async (newMeasurement) =>
            await createMeasurement.mutateAsync(newMeasurement))
    }

    useEffect(() => {
        if (!measurement) {
            reset({ whenAdded: moment().toDate() })
            return
        }

        reset({
            ...measurement,
            weight: Number(measurement.weight),
        })
        handleClickOpen()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [measurement?.id, reset])

    return (
        <form onSubmit={handleSubmitProxy()}>
            <ButtonPlusIcon onClick={handleClickOpen} />
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{t('home:ADD_WEIGHT')}</DialogTitle>
                <DialogContent>
                    <DatePicker
                        defaultDate={getValues().whenAdded}
                        onChange={newWhenAdded => setValue('whenAdded', moment(newWhenAdded).toDate())}
                        sx={{ marginTop: '8px' }}
                        register={register('whenAdded')}
                        maxDateTime={moment().toDate()}
                    />
                    <TextField
                        fullWidth
                        type="number"
                        margin="dense"
                        label="Weight"
                        variant="outlined"
                        defaultValue={defaultWeight}
                        {...register('weight')}
                        error={!!errors.weight}
                        helperText={errors.weight?.message}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>{t('deny')}</Button>
                    {measurement &&
                        <DialogConfirm onConfirmed={async () => await deleteMeasurement.mutateAsync({ id: measurement.id })}>
                            <Button color="error">{t('remove')}</Button>
                        </DialogConfirm>
                    }
                    <Button onClick={handleSubmitProxy()}>{t('accept')}</Button>
                </DialogActions>
            </Dialog>
        </form>
    )
}
