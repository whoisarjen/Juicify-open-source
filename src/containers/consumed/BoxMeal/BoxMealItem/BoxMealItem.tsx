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
        <div className="flex">
            <div>
                {isOwner ? (
                    <DialogEditConsumed consumed={consumed}>
                        <button className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="edit">
                            <Pencil size={20} />
                        </button>
                    </DialogEditConsumed>
                ) : (
                    <button className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="edit">
                        <UtensilsCrossed size={20} />
                    </button>
                )}
            </div>
            <div className="flex-1">
                <div className="font-bold">{product.name}</div>
                <div>
                    {Number(product.proteins)}
                    {t('P')} {Number(product.carbs)}
                    {t('C')} {Number(product.fats)}
                    {t('F')}
                </div>
            </div>
            <div className="text-right">
                <div className="font-bold">{getCalories(product)}kcal</div>
                <div>{Number(consumed.howMany) * 100}g/ml</div>
            </div>
        </div>
    )
}

export default BoxMealItem
