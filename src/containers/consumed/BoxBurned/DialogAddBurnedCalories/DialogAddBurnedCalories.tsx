import { zodResolver } from '@hookform/resolvers/zod';
import useTranslation from 'next-translate/useTranslation';
import { useForm } from 'react-hook-form';
import { useEffect, useState, type ReactNode } from 'react'
import { trpc } from '@/utils/trpc.utils';
import { createBurnedCaloriesSchema, CreateBurnedCaloriesSchema } from '@/server/schema/burnedCalories.schema';
import { useRouter } from 'next/router';
import moment from 'moment';

interface DialogAddBurnedCaloriesProps {
    children: ReactNode
}

export const DialogAddBurnedCalories = ({
    children,
}: DialogAddBurnedCaloriesProps) => {
    const { t } = useTranslation('nutrition-diary')
    const router = useRouter()

    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const utils = trpc.useUtils()

    const createBurnedCalories = trpc.burnedCalories.create.useMutation({
        onSuccess() {
            utils.burnedCalories.getPeriod.refetch() // TODO
        },
    })

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm<CreateBurnedCaloriesSchema>({ resolver: zodResolver(createBurnedCaloriesSchema) })

    const handleCreateBurnedCalories = async (newBurnedCalories: CreateBurnedCaloriesSchema) =>
        await createBurnedCalories.mutateAsync(newBurnedCalories)
            .finally(() => setIsDialogOpen(false))

    useEffect(() => {
        reset({ whenAdded: moment(router.query.date).add(moment().format("hh:mm:ss")).toDate(), burnedCalories: 0, name: 'Cardio' })
    }, [reset, router.query.date])

    return (
        <>
            <div onClick={() => setIsDialogOpen(true)}>{children}</div>
            {isDialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="fixed inset-0 bg-black/50" />
                    <div className="relative z-50 w-full max-w-lg rounded-lg bg-white p-0 shadow-xl dark:bg-gray-900">
                        <form onSubmit={handleSubmit(handleCreateBurnedCalories)}>
                            <div className="px-6 pt-6 text-lg font-semibold">
                                {t('Add')}
                            </div>
                            <div className="px-6 py-4">
                                <div className="mt-2.5 w-full">
                                    <label className="mb-1 block text-sm text-gray-500">{t('Name')}</label>
                                    <input
                                        className="w-full rounded border border-gray-300 bg-transparent px-3 py-2 outline-none focus:border-blue-500 dark:border-gray-600"
                                        {...register('name')}
                                    />
                                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name?.message}</p>}
                                </div>
                                <div className="mt-2.5 w-full">
                                    <label className="mb-1 block text-sm text-gray-500">{t("Burnt")}</label>
                                    <div className="flex items-center rounded border border-gray-300 bg-transparent focus-within:border-blue-500 dark:border-gray-600">
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
                                <button type="button" className="px-4 py-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-800" onClick={() => setIsDialogOpen(false)}>{t('Deny')}</button>
                                <button type="submit" className="px-4 py-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-800" onClick={handleSubmit(handleCreateBurnedCalories)}>{t('Confirm')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}
