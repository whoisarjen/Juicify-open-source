import { Info, UtensilsCrossed } from 'lucide-react'
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
    const [portionMode, setPortionMode] = useState(false)
    const [rawValue, setRawValue] = useState(
        String(product.howMany || 1)
    )

    const hasPortion = product.gramsPerPortion != null && product.gramsPerPortion > 0
    const gramsPerPortion = product.gramsPerPortion ?? 0

    const handleValueChange = (raw: string) => {
        const cleaned = raw.replace(',', '.')
        setRawValue(cleaned)
        const num = parseFloat(cleaned)
        if (isNaN(num)) {
            onValueChange(undefined)
            return
        }
        // Convert portions to howMany (× 100g multiplier)
        const howMany = portionMode ? (num * gramsPerPortion) / 100 : num
        onValueChange(howMany)
    }

    const togglePortionMode = () => {
        const newPortionMode = !portionMode
        setPortionMode(newPortionMode)
        // Reset to 1 portion or 100g (howMany=1) on toggle
        setRawValue('1')
        const howMany = newPortionMode ? gramsPerPortion / 100 : 1
        onValueChange(howMany)
    }

    // Calculate display values
    const num = parseFloat(rawValue.replace(',', '.')) || 1
    const howManyForCalc = portionMode ? (num * gramsPerPortion) / 100 : num
    const totalGrams = Math.round(howManyForCalc * 100)

    return (
        <div className="border-left-4 flex w-full flex-row items-center justify-center gap-2 rounded border p-2 text-sm border-l-4">
            <div className="flex-1">
                <div className="font-bold text-primary-dark">
                    {product.name}
                </div>
                <div>
                    <span className="text-macro-protein">{(Number(product.proteins) * howManyForCalc).toFixed(1)}{t('P')}</span>{' '}
                    <span className="text-macro-carbs">{(Number(product.carbs) * howManyForCalc).toFixed(1)}{t('C')}</span>{' '}
                    <span className="text-macro-fat">{(Number(product.fats) * howManyForCalc).toFixed(1)}{t('F')}</span>{' '}
                    <span className="text-macro-kcal">{Math.round(getCalories(product) * howManyForCalc)}kcal</span>
                    <span className="text-[#7a7a7a] text-[10px] ml-1">
                        per {totalGrams}g{portionMode && num !== 1 ? ` · ${num}pt` : ''}
                    </span>
                </div>
            </div>
            <DialogShowProduct product={product}>
                <div>
                    <button className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                        <Info size={20} className="text-[#90caf9]" />
                    </button>
                </div>
            </DialogShowProduct>
            {hasPortion && (
                <button
                    type="button"
                    onClick={togglePortionMode}
                    className={`w-[28px] h-[28px] rounded-lg flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                        portionMode
                            ? 'bg-[rgba(144,202,249,0.10)] border border-[rgba(144,202,249,0.25)] text-primary-dark'
                            : 'bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)] text-[#7a7a7a] hover:bg-[rgba(255,255,255,0.06)]'
                    }`}
                    aria-label="Toggle portion mode"
                >
                    <UtensilsCrossed size={13} />
                </button>
            )}
            <input
                type="text"
                value={rawValue}
                onChange={(e) => handleValueChange(e.target.value)}
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
