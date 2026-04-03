import { zodResolver } from '@hookform/resolvers/zod';
import useTranslation from 'next-translate/useTranslation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import DialogConfirm from '@/components/DialogConfirm/DialogConfirm';
import { type ConsumedSchema, consumedSchema } from '@/server/schema/consumed.schema';
import useConsumed from '@/hooks/useConsumed'
import { useState, type ReactNode } from 'react'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { range } from 'lodash-es';

interface DialogEditConsumedProps {
    children: ReactNode
    consumed: Consumed
}

const DialogEditConsumed = ({
    children,
    consumed,
}: DialogEditConsumedProps) => {
    const { t } = useTranslation('nutrition-diary')
    const router = useRouter()

    const username = router.query.login as string
    const whenAdded = router.query.date as string

    const { updateConsumed, deleteConsumed } = useConsumed({ username, startDate: whenAdded, endDate: whenAdded })
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const { data: sessionData } = useSession()

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm<ConsumedSchema>({ resolver: zodResolver(consumedSchema) })

    const handleUpdateConsumed = async (newConsumed: ConsumedSchema) =>
        await updateConsumed.mutateAsync({ ...consumed, ...newConsumed })
            .finally(() => setIsDialogOpen(false))

    useEffect(() => {
        reset({
            ...consumed,
            howMany: Number(consumed.howMany),
        })
    }, [reset, consumed])

    return (
        <form onSubmit={handleSubmit(handleUpdateConsumed)}>
            <div className="cursor-pointer" onClick={() => setIsDialogOpen(true)}>{children}</div>
            {isDialogOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    <div className="fixed inset-0 bg-black/50" />
                    <div className="relative z-[100] w-full max-w-lg rounded-lg bg-[#1a1a1f] p-0 shadow-xl mx-4">
                        <div className="px-6 pt-6 text-lg font-semibold">
                            {t('Edit')}
                        </div>
                        <div className="px-6 py-4">
                            <select
                                className="w-full rounded border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-600"
                                defaultValue={consumed.meal || 0}
                                {...register('meal')}
                            >
                                {range(sessionData?.user?.numberOfMeals || 0).map((x) =>
                                    <option key={x} value={x}>{t('Meal')} {x + 1}</option>
                                )}
                            </select>
                            <div className="mt-2.5 w-full">
                                <label className="mb-1 block text-sm text-gray-500">{t('How many times 100g/ml')}</label>
                                <input
                                    className="w-full rounded border border-gray-300 bg-transparent px-3 py-2 outline-none focus:border-blue-500 dark:border-gray-600"
                                    type="text"
                                    inputMode="decimal"
                                    {...register('howMany')}
                                />
                                {errors.howMany && <p className="mt-1 text-xs text-red-500">{errors.howMany?.message}</p>}
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 px-6 pb-6">
                            <DialogConfirm
                                onConfirmed={async () =>
                                    await deleteConsumed.mutateAsync({ id: consumed.id })
                                        .finally(() => setIsDialogOpen(false))
                                }
                            >
                                <button type="button" className="px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-gray-800">{t('Delete')}</button>
                            </DialogConfirm>
                            <button type="button" className="px-4 py-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-800" onClick={() => setIsDialogOpen(false)}>{t('Deny')}</button>
                            <button type="submit" className="px-4 py-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-800" onClick={handleSubmit(handleUpdateConsumed)}>{t('Confirm')}</button>
                        </div>
                    </div>
                </div>
            )}
        </form>
    );
}

export default DialogEditConsumed;
