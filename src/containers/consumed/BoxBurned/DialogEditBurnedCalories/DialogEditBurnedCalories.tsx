import { zodResolver } from '@hookform/resolvers/zod';
import useTranslation from 'next-translate/useTranslation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import DialogConfirm from '@/components/DialogConfirm/DialogConfirm';
import { useState, type ReactNode } from 'react'
import { type BurnedCalories } from '@prisma/client';
import { trpc } from '@/utils/trpc.utils';
import { burnedCaloriesSchema, BurnedCaloriesSchema } from '@/server/schema/burnedCalories.schema';
import { pick } from 'lodash-es';

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

    const utils = trpc.useUtils()

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
            <div className="cursor-pointer" onClick={() => setIsDialogOpen(true)}>{children}</div>
            {isDialogOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setIsDialogOpen(false)} />
                    <div className="relative z-[100] w-full max-w-lg rounded-lg bg-[#1a1a1f] p-0 shadow-xl mx-4">
                        <div className="px-6 pt-6 text-lg font-semibold">
                            {t('Edit')}
                        </div>
                        <div className="px-6 py-4">
                            <div className="mt-2.5 w-full">
                                <label className="mb-1 block text-sm text-gray-500">{t('Name')}</label>
                                <input
                                    className="w-full rounded border border-gray-300 bg-transparent px-3 py-2 outline-none focus:border-primary-dark dark:border-gray-600"
                                    {...register('name')}
                                />
                                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name?.message}</p>}
                            </div>
                            <div className="mt-2.5 w-full">
                                <label className="mb-1 block text-sm text-gray-500">{t("Burnt")}</label>
                                <div className="flex items-center rounded border border-gray-300 bg-transparent focus-within:border-primary-dark dark:border-gray-600">
                                    <input
                                        className="flex-1 bg-transparent px-3 py-2 outline-none"
                                        type="number"
                                        {...register('burnedCalories')}
                                    />
                                    <span className="px-3 text-sm text-gray-500">kcal</span>
                                </div>
                                {errors.burnedCalories && <p className="mt-1 text-xs text-red-500">{errors.burnedCalories?.message}</p>}
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 px-6 pb-6">
                            <DialogConfirm
                                onConfirmed={async () =>
                                    await deleteBurnedCalories.mutateAsync({ id: burnedCalories.id })
                                        .finally(() => setIsDialogOpen(false))
                                }
                            >
                                <button type="button" className="px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-gray-800">{t('Delete')}</button>
                            </DialogConfirm>
                            <button type="button" className="px-4 py-2 text-primary-dark hover:bg-[rgba(255,255,255,0.04)]" onClick={() => setIsDialogOpen(false)}>{t('Deny')}</button>
                            <button type="submit" className="px-4 py-2 text-primary-dark hover:bg-[rgba(255,255,255,0.04)]" onClick={handleSubmit(handleUpdateConsumed)}>{t('Confirm')}</button>
                        </div>
                    </div>
                </div>
            )}
        </form>
    )
}
