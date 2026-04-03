import useTranslation from 'next-translate/useTranslation';
import { cloneElement, useState, useMemo, type ReactElement } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';
import { useSession } from 'next-auth/react';
import { trpc } from '@/utils/trpc.utils';
import { getCalories } from '@/utils/consumed.utils';
import { UtensilsCrossed } from 'lucide-react';

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
    const [rawValue, setRawValue] = useState('1')
    const [portionMode, setPortionMode] = useState(false)
    const [mealToAdd, setMealToAdd] = useState(0)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const router: any = useRouter()

    const hasPortion = product.gramsPerPortion != null && product.gramsPerPortion > 0
    const gramsPerPortion = product.gramsPerPortion ?? 0

    const utils = trpc.useUtils()

    const createConsumed = trpc.consumed.create.useMutation({
        onSuccess() {
            setIsDialogOpen(false)
            utils.consumed.getPeriod.refetch()
        },
    })

    const num = parseFloat(rawValue.replace(',', '.')) || 1
    const howMany = portionMode ? (num * gramsPerPortion) / 100 : num
    const totalGrams = Math.round(howMany * 100)

    const scaled = useMemo(() => ({
        proteins: (Number(product.proteins) * howMany).toFixed(1),
        carbs: (Number(product.carbs) * howMany).toFixed(1),
        fats: (Number(product.fats) * howMany).toFixed(1),
        calories: Math.round(getCalories(product) * howMany),
    }), [product, howMany])

    const togglePortionMode = () => {
        const currentNum = parseFloat(rawValue.replace(',', '.')) || 1
        if (portionMode) {
            const newHowMany = (currentNum * gramsPerPortion) / 100
            setRawValue(String(Math.round(newHowMany * 100) / 100))
        } else {
            const portions = (currentNum * 100) / gramsPerPortion
            setRawValue(String(Math.round(portions * 10) / 10))
        }
        setPortionMode(!portionMode)
    }

    const addNewProduct = async () => {
        await createConsumed.mutateAsync({
            whenAdded: moment(router.query.date).add(moment().format("hh:mm:ss")).toDate(),
            howMany,
            productId: product.id,
            meal: mealToAdd || 0,
        })
    }

    return (
        <>
            {cloneElement(children, { onClick: () => setIsDialogOpen(true) })}
            {isDialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setIsDialogOpen(false)} />
                    <div className="relative z-50 w-full max-w-lg rounded-lg bg-white p-0 shadow-xl dark:bg-gray-900 mx-4">
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
                                <label className="mb-1 block text-sm text-gray-500">
                                    {portionMode ? t('How many portions?') || 'How many portions?' : t('How many times 100g/ml')}
                                </label>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 flex items-center rounded border border-gray-300 bg-transparent focus-within:border-primary-dark dark:border-gray-600">
                                        <input
                                            className="flex-1 bg-transparent px-3 py-2 outline-none"
                                            value={rawValue}
                                            inputMode="decimal"
                                            onChange={(e) => setRawValue(e.target.value)}
                                        />
                                        <span className="px-3 text-sm text-gray-500">
                                            {portionMode ? 'portions' : 'x 100g/ml'}
                                        </span>
                                    </div>
                                    {hasPortion && (
                                        <button
                                            type="button"
                                            onClick={togglePortionMode}
                                            className={`w-[36px] h-[36px] rounded-lg flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                                                portionMode
                                                    ? 'bg-[rgba(144,202,249,0.10)] border border-[rgba(144,202,249,0.25)] text-primary-dark'
                                                    : 'bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)] text-[#7a7a7a] hover:bg-[rgba(255,255,255,0.06)]'
                                            }`}
                                            aria-label="Toggle portion mode"
                                        >
                                            <UtensilsCrossed size={16} />
                                        </button>
                                    )}
                                </div>
                                {portionMode && (
                                    <div className="text-[11px] text-primary-dark font-semibold mt-1.5">
                                        1 portion = {gramsPerPortion}g
                                    </div>
                                )}
                            </div>

                            {/* Calculated macros preview */}
                            <div className="mt-3 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] px-3 py-2.5">
                                <div className="text-[10px] uppercase tracking-wider text-[#7a7a7a] mb-1.5">
                                    per {totalGrams}g{portionMode && ` · ${num} portion${num !== 1 ? 's' : ''}`}
                                </div>
                                <div className="flex items-center gap-3 text-xs font-semibold">
                                    <span className="text-macro-protein">{scaled.proteins}P</span>
                                    <span className="text-macro-carbs">{scaled.carbs}C</span>
                                    <span className="text-macro-fat">{scaled.fats}F</span>
                                    <span className="text-macro-kcal">{scaled.calories}kcal</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 px-6 pb-6">
                            <button className="px-4 py-2 text-primary-dark hover:bg-[rgba(255,255,255,0.04)]" onClick={() => setIsDialogOpen(false)}>{t('Deny')}</button>
                            <button className="px-4 py-2 text-primary-dark hover:bg-[rgba(255,255,255,0.04)]" onClick={addNewProduct}>{t('Confirm')}</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default DialogAddProduct;
