import { MeasurementFieldsFragment, useUpdateMeasurementMutation, useCreateMeasurementMutation } from "@/generated/graphql"
import { Dialog, DialogContent, DialogActions, Button } from "@mui/material"
import InputAdornment from '@mui/material/InputAdornment';
import useTranslation from "next-translate/useTranslation"
import { useEffect } from "react"
import SlideUp from "transition/SlideUp"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { object, preprocess, string, TypeOf, number } from "zod"
import TextField from '@mui/material/TextField';
import { omit } from 'lodash'
import { useSession } from "next-auth/react";

const MeasurementSchema = object({
    id: string(),
    weight: preprocess((val) => Number(val), number().min(0).max(1000)),
})

type MeasurementSchemaProps = TypeOf<typeof MeasurementSchema>

interface MeasurementsDialogUpdateWeightProps {
    measurement: MeasurementFieldsFragment & { isFake?: boolean } | null
    onClose: () => void
}

const MeasurementsDialogUpdateWeight = ({
    measurement,
    onClose,
}: MeasurementsDialogUpdateWeightProps) => {
    const { t } = useTranslation()
    const { data: sessionData } = useSession()
    const [, createMeasurement] = useCreateMeasurementMutation()
    const [, updateMeasurement] = useUpdateMeasurementMutation()

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm<MeasurementSchemaProps>({
        resolver: zodResolver(MeasurementSchema)
    })

    const onConfirm = async ({ weight }: MeasurementSchemaProps) => {
        if (measurement) {
            if (measurement.isFake) {
                await createMeasurement({
                    ...omit(measurement, ['isFake']),
                    weight,
                    user: sessionData?.user?.id || '',
                })
            } else {
                await updateMeasurement({
                    ...measurement,
                    weight,
                    user: sessionData?.user?.id || '',
                })
            }
        }
        onClose()
    }

    useEffect(() => {
        measurement && reset(measurement)
    }, [measurement?.weight, measurement?.id])

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