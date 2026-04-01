import useTranslation from 'next-translate/useTranslation';
import { cloneElement, useState, type ReactElement } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';
import { useSession } from 'next-auth/react';
import { trpc } from '@/utils/trpc.utils';

interface DialogAddProductProps {
    children: ReactElement
    product: Product
}

const DialogAddProduct = ({
    children,
    product,
}: DialogAddProductProps) => {
    const { t } = useTranslation('nutrition-diary')
    const { data: sessionData } = useSession()
    const [howMany, setHowMany] = useState<number | undefined>(1.0)
    const [mealToAdd, setMealToAdd] = useState(0)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const router: any = useRouter()

    const utils = trpc.useUtils()

    const createConsumed = trpc.consumed.create.useMutation({ // TODO move to useConsumed and remove in diffrent places
        onSuccess(data, variables, context) {
            setIsDialogOpen(false) // TODO should close all open dialogs

            utils
                .consumed
                .getPeriod
                .refetch() // TODO
        },
    })

    const addNewProduct = async () => {
        await createConsumed.mutateAsync({
            whenAdded: moment(router.query.date).add(moment().format("hh:mm:ss")).toDate(), // TODO It has to be local date
            howMany: howMany || 1,
            productId: product.id,
            meal: mealToAdd || 0, // TODO should also get from props
        })
    }

    return (
        <>
            {cloneElement(children, { onClick: () => setIsDialogOpen(true) })}
            {isDialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setIsDialogOpen(false)} />
                    <div className="relative z-50 w-full max-w-lg rounded-lg bg-white p-0 shadow-xl dark:bg-gray-900">
                        <div className="px-6 pt-6 text-lg font-semibold">{t('ADD_TO_DIARY')}</div>
                        <div className="px-6 py-4">
                            <select
                                className="mb-2.5 w-full rounded border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-600"
                                value={mealToAdd}
                                onChange={(e) => setMealToAdd(Number(e.target.value))}
                            >
                                {
                                    [...Array(sessionData?.user?.numberOfMeals)].map((x, i) =>
                                        <option key={i} value={i}>{t('Meal')} {i + 1}</option>
                                    )
                                }
                            </select>
                            <div className="mt-3 w-full">
                                <label className="mb-1 block text-sm text-gray-500">{t('How many times 100g/ml')}</label>
                                <div className="flex items-center rounded border border-gray-300 bg-transparent focus-within:border-blue-500 dark:border-gray-600">
                                    <input
                                        className="flex-1 bg-transparent px-3 py-2 outline-none"
                                        value={howMany}
                                        onChange={(e) => setHowMany(e.target.value ? Number(e.target.value) : undefined)}
                                    />
                                    <span className="px-3 text-sm text-gray-500">x 100g/ml</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 px-6 pb-6">
                            <button className="px-4 py-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-800" onClick={() => setIsDialogOpen(false)}>{t('Deny')}</button>
                            <button className="px-4 py-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-800" onClick={addNewProduct}>{t('Confirm')}</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default DialogAddProduct;
