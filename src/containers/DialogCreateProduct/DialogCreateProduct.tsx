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
            {isDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="fixed inset-0 bg-black/50" />
                    <div className="relative z-50 w-full max-w-lg rounded-lg bg-white p-0 shadow-xl dark:bg-gray-900">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="px-6 pt-6 text-lg font-semibold">{t('Create product')}</div>
                            <div className="px-6 py-4">
                                <p className="text-sm text-gray-500">
                                    {t('Create product description')}
                                </p>
                                <div className="w-full">
                                    <label className="mb-1 block text-sm text-gray-500">{t('Name of product')}</label>
                                    <input
                                        className="w-full rounded border border-gray-300 bg-transparent px-3 py-2 outline-none focus:border-blue-500 dark:border-gray-600"
                                        type="text"
                                        {...register('name')}
                                    />
                                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name?.message}</p>}
                                </div>
                                <div className="mt-3 w-full">
                                    <label className="mb-1 block text-sm text-gray-500">Barcode</label>
                                    <input
                                        className="w-full rounded border border-gray-300 bg-transparent px-3 py-2 outline-none focus:border-blue-500 dark:border-gray-600"
                                        type="number"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        {...register('barcode')}
                                    />
                                    {errors.barcode && <p className="mt-1 text-xs text-red-500">{errors.barcode?.message}</p>}
                                </div>
                                <div className="mt-3 w-full">
                                    <label className="mb-1 block text-sm text-gray-500">{t('Proteins')}</label>
                                    <div className="flex items-center rounded border border-gray-300 bg-transparent focus-within:border-blue-500 dark:border-gray-600">
                                        <input
                                            className="flex-1 bg-transparent px-3 py-2 outline-none"
                                            {...register('proteins')}
                                        />
                                        <span className="px-3 text-sm text-gray-500">{t('g in 100g/ml')}</span>
                                    </div>
                                    {errors.proteins && <p className="mt-1 text-xs text-red-500">{errors.proteins?.message}</p>}
                                </div>
                                <div className="mt-3 w-full">
                                    <label className="mb-1 block text-sm text-gray-500">{t('Carbs')}</label>
                                    <div className="flex items-center rounded border border-gray-300 bg-transparent focus-within:border-blue-500 dark:border-gray-600">
                                        <input
                                            className="flex-1 bg-transparent px-3 py-2 outline-none"
                                            {...register('carbs')}
                                        />
                                        <span className="px-3 text-sm text-gray-500">{t('g in 100g/ml')}</span>
                                    </div>
                                    {errors.carbs && <p className="mt-1 text-xs text-red-500">{errors.carbs?.message}</p>}
                                </div>
                                <div className="mt-3 w-full">
                                    <label className="mb-1 block text-sm text-gray-500">{t('Sugar')}</label>
                                    <div className="flex items-center rounded border border-gray-300 bg-transparent focus-within:border-blue-500 dark:border-gray-600">
                                        <input
                                            className="flex-1 bg-transparent px-3 py-2 outline-none"
                                            {...register('sugar')}
                                        />
                                        <span className="px-3 text-sm text-gray-500">{t('g in 100g/ml')}</span>
                                    </div>
                                    {errors.sugar && <p className="mt-1 text-xs text-red-500">{errors.sugar?.message}</p>}
                                </div>
                                <div className="mt-3 w-full">
                                    <label className="mb-1 block text-sm text-gray-500">{t('Fats')}</label>
                                    <div className="flex items-center rounded border border-gray-300 bg-transparent focus-within:border-blue-500 dark:border-gray-600">
                                        <input
                                            className="flex-1 bg-transparent px-3 py-2 outline-none"
                                            {...register('fats')}
                                        />
                                        <span className="px-3 text-sm text-gray-500">{t('g in 100g/ml')}</span>
                                    </div>
                                    {errors.fats && <p className="mt-1 text-xs text-red-500">{errors.fats?.message}</p>}
                                </div>
                                <div className="mt-3 w-full">
                                    <label className="mb-1 block text-sm text-gray-500">{t('Fiber')}</label>
                                    <div className="flex items-center rounded border border-gray-300 bg-transparent focus-within:border-blue-500 dark:border-gray-600">
                                        <input
                                            className="flex-1 bg-transparent px-3 py-2 outline-none"
                                            {...register('fiber')}
                                        />
                                        <span className="px-3 text-sm text-gray-500">{t('g in 100g/ml')}</span>
                                    </div>
                                    {errors.fiber && <p className="mt-1 text-xs text-red-500">{errors.fiber?.message}</p>}
                                </div>
                                <div className="mt-3 w-full">
                                    <label className="mb-1 block text-sm text-gray-500">{t('Salt')}</label>
                                    <div className="flex items-center rounded border border-gray-300 bg-transparent focus-within:border-blue-500 dark:border-gray-600">
                                        <input
                                            className="flex-1 bg-transparent px-3 py-2 outline-none"
                                            {...register('sodium')}
                                        />
                                        <span className="px-3 text-sm text-gray-500">{t('g in 100g/ml')}</span>
                                    </div>
                                    {errors.sodium && <p className="mt-1 text-xs text-red-500">{errors.sodium?.message}</p>}
                                </div>
                                <div className="mt-3 w-full">
                                    <label className="mb-1 block text-sm text-gray-500">{t('Ethanol')}</label>
                                    <div className="flex items-center rounded border border-gray-300 bg-transparent focus-within:border-blue-500 dark:border-gray-600">
                                        <input
                                            className="flex-1 bg-transparent px-3 py-2 outline-none"
                                            {...register('ethanol')}
                                        />
                                        <span className="px-3 text-sm text-gray-500">{t('g in 100g/ml')}</span>
                                    </div>
                                    {errors.ethanol && <p className="mt-1 text-xs text-red-500">{errors.ethanol?.message}</p>}
                                </div>
                                <label className="flex items-center gap-2 py-2 text-sm">
                                    <input
                                        type="checkbox"
                                        role="switch"
                                        {...register('isExpectingCheck')}
                                        className="h-5 w-5 accent-blue-500"
                                    />
                                    {t('Should be available for all?')}
                                </label>
                            </div>
                            <div className="flex justify-end gap-2 px-6 pb-6">
                                <button className="px-4 py-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-800" onClick={() => setIsDialog(false)}>
                                    {t('Cancel')}
                                </button>
                                <button
                                    disabled={createProduct.isLoading}
                                    className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
                                    type="submit"
                                >
                                    {createProduct.isLoading ? <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : t('Submit')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

export default DialogCreateProduct
