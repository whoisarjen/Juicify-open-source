import useTranslation from "next-translate/useTranslation"
import { useEffect, useState } from 'react'
import ButtonPlusIcon from "@/components/ButtonPlusIcon/ButtonPlusIcon"
import {
    supplementSchema,
    type SupplementSchema,
    createSupplementSchema,
    type CreateSupplementSchema,
} from "@/server/schema/supplement.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { trpc } from "@/utils/trpc.utils"
import DialogConfirm from "@/components/DialogConfirm/DialogConfirm"
import { Trash2 } from 'lucide-react'

interface DialogSupplementProps {
    supplement: SupplementSchema | null
    externalOpen?: boolean
    onClose?: () => void
    hideButton?: boolean
}

const TIME_OF_DAY_OPTIONS = ['morning', 'preworkout', 'evening', 'bedtime'] as const

const UNIT_OPTIONS = ['mg', 'g', 'mcg', 'IU', 'ml', 'tablet', 'capsule'] as const

export const DialogSupplement = ({
    supplement,
    externalOpen,
    onClose: onExternalClose,
    hideButton,
}: DialogSupplementProps) => {
    const [internalOpen, setInternalOpen] = useState(false)
    const open = externalOpen ?? internalOpen
    const { t } = useTranslation('supplements')
    const { t: tHome } = useTranslation('home')

    const {
        register,
        formState: { errors },
        handleSubmit,
        control,
        reset,
        setValue,
        watch,
    } = useForm<CreateSupplementSchema | SupplementSchema>({
        resolver: zodResolver(supplement ? supplementSchema : createSupplementSchema),
        defaultValues: {
            ingredients: [{ name: '', amount: 0, unit: 'mg' }],
            timeOfDay: 'morning',
            frequency: 1,
            isActive: true,
        },
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'ingredients',
    })

    const timeOfDay = watch('timeOfDay')
    const frequency = watch('frequency')

    const handleClickOpen = () => setInternalOpen(true)

    const handleClose = () => {
        setInternalOpen(false)
        onExternalClose?.()
        reset({
            ingredients: [{ name: '', amount: 0, unit: 'mg' }],
            timeOfDay: 'morning',
            frequency: 1,
            isActive: true,
        })
    }

    const utils = trpc.useUtils()

    const createSupplement = trpc.supplement.create.useMutation({
        onSuccess(data) {
            handleClose()
            utils.supplement.getAll.setData(undefined, currentData =>
                [...(currentData || []), data].sort((a, b) => a.name.localeCompare(b.name))
            )
        },
    })

    const updateSupplement = trpc.supplement.update.useMutation({
        onSuccess(data) {
            handleClose()
            utils.supplement.getAll.setData(undefined, currentData =>
                (currentData || []).map(s => s.id === data.id ? data : s)
                    .sort((a, b) => a.name.localeCompare(b.name))
            )
        },
    })

    const deleteSupplement = trpc.supplement.delete.useMutation({
        onSuccess(_, variables) {
            handleClose()
            utils.supplement.getAll.setData(undefined, currentData =>
                (currentData || []).filter(s => s.id !== variables.id)
            )
        },
    })

    const handleSubmitProxy = () => {
        if (supplement) {
            return handleSubmit(async (data) =>
                await updateSupplement.mutateAsync(data as SupplementSchema))
        }
        return handleSubmit(async (data) =>
            await createSupplement.mutateAsync(data))
    }

    useEffect(() => {
        if (!supplement) {
            reset({
                ingredients: [{ name: '', amount: 0, unit: 'mg' }],
                timeOfDay: 'morning',
                frequency: 1,
                    isActive: true,
            })
            return
        }

        reset({
            ...supplement,
            ingredients: supplement.ingredients as CreateSupplementSchema['ingredients'],
        })
        handleClickOpen()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [supplement?.id, reset])

    const isPending = createSupplement.isPending || updateSupplement.isPending || deleteSupplement.isPending

    return (
        <form onSubmit={handleSubmitProxy()}>
            {!hideButton && <ButtonPlusIcon onClick={handleClickOpen} />}
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="fixed inset-0 bg-black/50" onClick={handleClose} />
                    <div className="relative z-50 mx-4 w-full max-w-lg rounded-lg bg-white p-0 shadow-xl dark:bg-gray-900 max-h-[90vh] overflow-y-auto">
                        <div className="px-6 pt-6 text-lg font-semibold">
                            {supplement ? t('Edit supplement') : t('Add supplement')}
                        </div>
                        <div className="flex flex-col gap-3 px-6 py-4">
                            {/* Name */}
                            <div>
                                <label className="mb-1 block text-sm text-gray-500">{t('Name')}</label>
                                <div className="flex items-center rounded border border-gray-300 bg-transparent focus-within:border-primary-dark dark:border-gray-600">
                                    <input
                                        className="flex-1 bg-transparent px-3 py-2 outline-none"
                                        type="text"
                                        placeholder="e.g. Creatine, NOW Multi..."
                                        {...register('name')}
                                    />
                                </div>
                                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                            </div>

                            {/* Time of Day */}
                            <div>
                                <label className="mb-1 block text-sm text-gray-500">{t('Time of day')}</label>
                                <div className="flex flex-wrap gap-2">
                                    {TIME_OF_DAY_OPTIONS.map(option => (
                                        <button
                                            key={option}
                                            type="button"
                                            className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-all cursor-pointer ${
                                                timeOfDay === option
                                                    ? 'bg-primary-dark/20 text-primary-dark border border-primary-dark/30'
                                                    : 'bg-transparent border border-gray-300 text-gray-500 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800'
                                            }`}
                                            onClick={() => setValue('timeOfDay', option)}
                                        >
                                            {t(option)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Frequency */}
                            <div>
                                <label className="mb-1 block text-sm text-gray-500">{t('Frequency')}</label>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center rounded border border-gray-300 bg-transparent focus-within:border-primary-dark dark:border-gray-600">
                                        <input
                                            className="w-16 bg-transparent px-3 py-2 text-center outline-none"
                                            type="number"
                                            min={1}
                                            max={365}
                                            {...register('frequency')}
                                        />
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {Number(frequency) === 1 ? t('Every day') : t('Every X days', { count: frequency })}
                                    </span>
                                </div>
                                {errors.frequency && <p className="mt-1 text-xs text-red-500">{errors.frequency.message}</p>}
                            </div>

                            {/* Ingredients */}
                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <label className="text-sm text-gray-500">{t('Ingredients')}</label>
                                    <span className="text-xs text-gray-400">{fields.length} added</span>
                                </div>

                                <div className="flex flex-col gap-2">
                                    {fields.map((field, index) => (
                                        <div key={field.id} className="flex items-center gap-2">
                                            <input
                                                className={`flex-1 rounded border bg-transparent px-2 py-1.5 text-sm outline-none focus:border-primary-dark dark:border-gray-600 ${
                                                    errors.ingredients?.[index]?.name ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                                type="text"
                                                placeholder="Nutrient name"
                                                {...register(`ingredients.${index}.name`)}
                                            />
                                            <input
                                                className="w-20 rounded border border-gray-300 bg-transparent px-2 py-1.5 text-right text-sm outline-none focus:border-primary-dark dark:border-gray-600"
                                                type="text"
                                                inputMode="decimal"
                                                placeholder="100"
                                                {...register(`ingredients.${index}.amount`)}
                                            />
                                            <select
                                                className="rounded border border-gray-300 bg-transparent px-1 py-1.5 text-sm outline-none dark:border-gray-600"
                                                {...register(`ingredients.${index}.unit`)}
                                            >
                                                {UNIT_OPTIONS.map(u => (
                                                    <option key={u} value={u}>{u}</option>
                                                ))}
                                            </select>
                                            {fields.length > 1 && (
                                                <button
                                                    type="button"
                                                    className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-gray-800 cursor-pointer"
                                                    onClick={() => remove(index)}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {errors.ingredients && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.ingredients.root?.message || errors.ingredients.message}
                                    </p>
                                )}

                                <button
                                    type="button"
                                    className="mt-2 w-full rounded-lg border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-400 hover:border-primary-dark hover:text-primary-dark dark:border-gray-600 cursor-pointer transition-all"
                                    onClick={() => append({ name: '', amount: 0, unit: 'mg' })}
                                >
                                    + {t('Add ingredient')}
                                </button>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-2 px-6 pb-6">
                            <button
                                type="button"
                                className="px-4 py-2 text-primary-dark hover:bg-[rgba(255,255,255,0.04)] cursor-pointer"
                                onClick={handleClose}
                            >
                                {tHome('deny')}
                            </button>
                            {supplement && (
                                <DialogConfirm onConfirmed={async () => await deleteSupplement.mutateAsync({ id: supplement.id })}>
                                    <button
                                        type="button"
                                        className="px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-gray-800 cursor-pointer"
                                    >
                                        {tHome('remove')}
                                    </button>
                                </DialogConfirm>
                            )}
                            <button
                                type="button"
                                className="px-4 py-2 text-primary-dark hover:bg-[rgba(255,255,255,0.04)] cursor-pointer disabled:opacity-50"
                                disabled={isPending}
                                onClick={handleSubmitProxy()}
                            >
                                {tHome('accept')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </form>
    )
}
