import { Info } from 'lucide-react'
import useTranslation from 'next-translate/useTranslation'
import { useState } from 'react'
import { getCalories } from '@/utils/consumed.utils'
import DialogShowProduct from './DialogShowProduct/DialogShowProduct'

interface BoxProductProps {
    product: Product & { howMany?: number }
    isChecked: boolean
    onCheckClick: () => void
    onValueChange: (howMany: number | undefined) => void
}

const BoxAddProduct = ({
    product,
    isChecked,
    onCheckClick,
    onValueChange,
}: BoxProductProps) => {
    const { t } = useTranslation('nutrition-diary')
    const [howMany, setHowMany] = useState(
        String(product.howMany || 1)
    )

    const handleHowManyChange = (raw: string) => {
        const cleaned = raw.replace(',', '.')
        setHowMany(cleaned)
        const num = parseFloat(cleaned)
        onValueChange(isNaN(num) ? undefined : num)
    }

    return (
        <div className="border-left-4 flex w-full flex-row items-center justify-center gap-2 rounded border p-2 text-sm border-l-4">
            <div className="flex-1">
                <div className="font-bold text-primary-dark">
                    {product.name}
                </div>
                <div>
                    {(() => {
                        const qty = parseFloat(howMany.replace(',', '.')) || 1
                        const p = (Number(product.proteins) * qty).toFixed(1)
                        const c = (Number(product.carbs) * qty).toFixed(1)
                        const f = (Number(product.fats) * qty).toFixed(1)
                        const kcal = Math.round(getCalories(product) * qty)
                        const grams = Math.round(qty * 100)
                        return (
                            <>
                                <span className="text-macro-protein">{p}{t('P')}</span>{' '}
                                <span className="text-macro-carbs">{c}{t('C')}</span>{' '}
                                <span className="text-macro-fat">{f}{t('F')}</span>{' '}
                                <span className="text-macro-kcal">{kcal}kcal</span>
                                <span className="text-[#7a7a7a] text-[10px] ml-1">per {grams}g/ml</span>
                            </>
                        )
                    })()}
                </div>
            </div>
            <DialogShowProduct product={product}>
                <div>
                    <button className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                        <Info size={20} className="text-[#90caf9]" />
                    </button>
                </div>
            </DialogShowProduct>
            <input
                type="text"
                value={howMany}
                onChange={(e) => handleHowManyChange(e.target.value)}
                inputMode="decimal"
                className="max-w-[52px] rounded border border-gray-300 bg-transparent px-3 py-2 outline-none focus:border-primary-dark dark:border-gray-600"
            />
            <input
                data-testid="checked"
                type="checkbox"
                checked={isChecked}
                onChange={onCheckClick}
                aria-label="controlled"
                className="h-5 w-5 accent-blue-500"
            />
        </div>
    )
}

export default BoxAddProduct
