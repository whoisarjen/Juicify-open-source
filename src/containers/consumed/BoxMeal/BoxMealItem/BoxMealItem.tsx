import { getCalories, multipleProductByHowMany } from '@/utils/consumed.utils'
import { Pencil, UtensilsCrossed } from 'lucide-react'
import IconButton from '@mui/material/IconButton'
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
                        <IconButton aria-label="edit">
                            <Pencil size={20} />
                        </IconButton>
                    </DialogEditConsumed>
                ) : (
                    <IconButton aria-label="edit">
                        <UtensilsCrossed size={20} />
                    </IconButton>
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
