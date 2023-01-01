import { Dialog, DialogContent, DialogActions, Button } from "@mui/material"
import InputAdornment from '@mui/material/InputAdornment';
import useTranslation from "next-translate/useTranslation"
import SlideUp from '@/transition/SlideUp'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import TextField from '@mui/material/TextField';
import { type MeasurementSchema, measurementSchema } from "@/server/schema/measurement.schema";
import { useEffect } from "react";
import { trpc } from "@/utils/trpc";
import { useSession } from "next-auth/react";
import moment from "moment";

const whenAdded = moment().format('YYYY-MM-DD')

interface MeasurementsDialogUpdateWeightProps {
    measurement: Measurement | null
    onClose: () => void
}

const MeasurementsDialogUpdateWeight = ({
    measurement,
    onClose,
}: MeasurementsDialogUpdateWeightProps) => {
    const { t } = useTranslation()
    const { data: sessionData } = useSession()

    const username = sessionData?.user?.username || ''

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm<MeasurementSchema>({ resolver: zodResolver(measurementSchema) })

    const utils = trpc.useContext()

    const updateMeasurement = trpc.measurement.update.useMutation({
        onSuccess(data) {
            onClose()

            utils
                .measurement
                .getDay
                .setData({ username, whenAdded }, currentData => {
                    if (!currentData || data.id === currentData.id) {
                        return data
                    }

                    return currentData
                })

            utils
                .measurement
                .getAll
                .setData({ username }, currentData => currentData
                    ?.map(measurement => {
                        if (measurement.id === data.id) {
                            return {
                                ...measurement,
                                ...data,
                            }
                        }

                        return measurement
                    }))
        },
    })

    const onConfirm = async (newMeasurement: MeasurementSchema) =>
        await updateMeasurement.mutateAsync(newMeasurement)

    useEffect(() => {
        if (measurement) {
            reset({
                ...measurement,
                weight: Number(measurement.weight),
            })
        }
    }, [measurement, measurement?.id, reset])

    return (
        <Dialog
            open={!!measurement}
            onClose={onClose}
            TransitionComponent={SlideUp}
        >
            <DialogContent>
                <TextField
                    label={t('WEIGHT')}
                    variant="outlined"
                    fullWidth
                    {...register('weight')}
                    error={!!errors.weight}
                    helperText={!!errors?.weight?.message && errors.weight.message}
                    inputProps={{
                        inputMode: 'numeric',
                        pattern: '[0-9]*',
                        endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>{t('Deny')}</Button>
                <Button onClick={handleSubmit(onConfirm)}>{t('Confirm')}</Button>
            </DialogActions>
        </Dialog>
    )
}

export default MeasurementsDialogUpdateWeight