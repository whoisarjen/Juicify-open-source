import { getCalories, multipleProductByHowMany } from '@/utils/consumed.utils'
import { Pencil, UtensilsCrossed } from 'lucide-react'
import useTranslation from 'next-translate/useTranslation'
import DialogEditConsumed from '@/containers/consumed/BoxMeal/BoxMealItem/DialogEditConsumed/DialogEditConsumed'

interface BoxMealItemProps {
    consumed: Consumed
    isOwner: boolean
}

const BoxMealItem = ({ consumed, isOwner }: BoxMealItemProps) => {
    const { t } = useTranslation('nutrition-diary')
    const { product } = multipleProductByHowMany(consumed)

    return (
        <div className="flex items-center gap-2 py-2">
            <div className="shrink-0">
                {isOwner ? (
                    <DialogEditConsumed consumed={consumed}>
                        <button type="button" className="w-[28px] h-[28px] rounded-lg bg-[rgba(255,255,255,0.03)] flex items-center justify-center text-[#7a7a7a] hover:bg-[rgba(255,255,255,0.06)] transition-all cursor-pointer" aria-label="edit">
                            <Pencil size={13} />
                        </button>
                    </DialogEditConsumed>
                ) : (
                    <button className="w-[28px] h-[28px] rounded-lg bg-[rgba(255,255,255,0.03)] flex items-center justify-center text-[#7a7a7a]" aria-label="view">
                        <UtensilsCrossed size={13} />
                    </button>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-xs font-bold truncate text-white">{product.name}</div>
                <div className="text-[11px] text-[#7a7a7a] flex gap-1">
                    <span>{Number(product.proteins).toFixed(1)}{t('P')}</span>
                    <span>{Number(product.carbs).toFixed(1)}{t('C')}</span>
                    <span>{Number(product.fats).toFixed(1)}{t('F')}</span>
                </div>
            </div>
            <div className="text-right shrink-0">
                <div className="text-xs font-bold">{getCalories(product)}kcal</div>
                <div className="text-[11px] text-[#7a7a7a]">{Math.round(Number(consumed.howMany) * 100)}g/ml</div>
            </div>
        </div>
    )
}

export default BoxMealItem
