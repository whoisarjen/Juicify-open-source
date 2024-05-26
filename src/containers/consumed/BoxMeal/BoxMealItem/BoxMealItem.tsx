import { getCalories, multipleProductByHowMany } from '@/utils/consumed.utils'
import EditIcon from '@mui/icons-material/Edit'
import FastfoodIcon from '@mui/icons-material/Fastfood'
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
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </DialogEditConsumed>
                ) : (
                    <IconButton aria-label="edit">
                        <FastfoodIcon fontSize="small" />
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
