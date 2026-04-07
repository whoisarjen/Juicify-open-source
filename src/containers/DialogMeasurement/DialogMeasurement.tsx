import useTranslation from "next-translate/useTranslation"
import { useEffect, useState, type ReactNode } from 'react'
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
import { trpc } from "@/utils/trpc.utils"
import { orderBy } from 'lodash-es'
import { useSession } from "next-auth/react"
import DialogConfirm from "@/components/DialogConfirm/DialogConfirm"
import { updateArray } from '@/utils/global.utils'

interface DialogMeasurementProps {
    measurement: Measurement | null
    defaultWeight?: number
    externalOpen?: boolean
    onClose?: () => void
    hideButton?: boolean
}

const today = moment().format('YYYY-MM-DD')

export const DialogMeasurement = ({
    measurement,
    defaultWeight = 0,
    externalOpen,
    onClose: onExternalClose,
    hideButton,
}: DialogMeasurementProps) => {
    const [internalOpen, setInternalOpen] = useState(false)
    const open = externalOpen ?? internalOpen
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
        setInternalOpen(true)
    }

    const handleClose = () => {
        setInternalOpen(false)
        onExternalClose?.()
        reset({ whenAdded: moment().toDate(), weight: defaultWeight })
    }

    const utils = trpc.useUtils()
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
            waist: measurement.waist ? Number(measurement.waist) : undefined,
            hips: measurement.hips ? Number(measurement.hips) : undefined,
            pulseSleep: measurement.pulseSleep ?? undefined,
            pulseFatigue: measurement.pulseFatigue ?? undefined,
            pulseMood: measurement.pulseMood ?? undefined,
            pulseSoreness: measurement.pulseSoreness ?? undefined,
            pulseStress: measurement.pulseStress ?? undefined,
            pulseErection: measurement.pulseErection ?? undefined,
        })
        handleClickOpen()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [measurement?.id, reset])

    return (
        <form onSubmit={handleSubmitProxy()}>
            {!hideButton && <ButtonPlusIcon onClick={handleClickOpen} />}
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="fixed inset-0 bg-black/50" onClick={handleClose} />
                    <div className="relative z-50 w-full max-w-lg rounded-lg bg-white p-0 shadow-xl dark:bg-gray-900">
                        <div className="px-6 pt-6 text-lg font-semibold">{t('home:ADD_WEIGHT')}</div>
                        <div className="px-6 py-4">
                            <DatePicker
                                defaultDate={getValues().whenAdded}
                                onChange={newWhenAdded => setValue('whenAdded', moment(newWhenAdded).toDate())}
                                sx={{ marginTop: '8px' }}
                                maxDateTime={moment().toDate()}
                            />
                            <div className="mt-2 w-full">
                                <label className="mb-1 block text-sm text-gray-500">Weight</label>
                                <div className="flex items-center rounded border border-gray-300 bg-transparent focus-within:border-primary-dark dark:border-gray-600">
                                    <input
                                        className="flex-1 bg-transparent px-3 py-2 outline-none"
                                        type="text"
                                        inputMode="decimal"
                                        defaultValue={defaultWeight}
                                        {...register('weight')}
                                    />
                                    <span className="px-3 text-sm text-gray-500">kg</span>
                                </div>
                                {errors.weight && <p className="mt-1 text-xs text-red-500">{errors.weight?.message}</p>}
                            </div>
                            <div className="mt-2 w-full">
                                <label className="mb-1 block text-sm text-gray-500">Waist</label>
                                <div className="flex items-center rounded border border-gray-300 bg-transparent focus-within:border-primary-dark dark:border-gray-600">
                                    <input
                                        className="flex-1 bg-transparent px-3 py-2 outline-none"
                                        type="text"
                                        inputMode="decimal"
                                        {...register('waist')}
                                    />
                                    <span className="px-3 text-sm text-gray-500">cm</span>
                                </div>
                            </div>
                            <div className="mt-2 w-full">
                                <label className="mb-1 block text-sm text-gray-500">Hips</label>
                                <div className="flex items-center rounded border border-gray-300 bg-transparent focus-within:border-primary-dark dark:border-gray-600">
                                    <input
                                        className="flex-1 bg-transparent px-3 py-2 outline-none"
                                        type="text"
                                        inputMode="decimal"
                                        {...register('hips')}
                                    />
                                    <span className="px-3 text-sm text-gray-500">cm</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 px-6 pb-6">
                            <button className="px-4 py-2 text-primary-dark hover:bg-[rgba(255,255,255,0.04)]" onClick={handleClose}>{t('deny')}</button>
                            {measurement &&
                                <DialogConfirm onConfirmed={async () => await deleteMeasurement.mutateAsync({ id: measurement.id })}>
                                    <button className="px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-gray-800">{t('remove')}</button>
                                </DialogConfirm>
                            }
                            <button className="px-4 py-2 text-primary-dark hover:bg-[rgba(255,255,255,0.04)]" onClick={handleSubmitProxy()}>{t('accept')}</button>
                        </div>
                    </div>
                </div>
            )}
        </form>
    )
}
