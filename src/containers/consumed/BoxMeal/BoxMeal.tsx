import { Plus } from 'lucide-react'
import useTranslation from 'next-translate/useTranslation'
import { Fragment, useMemo } from 'react'
import BoxMealItem from '@/containers/consumed/BoxMeal/BoxMealItem/BoxMealItem'
import { sumMacroFromConsumed } from '@/utils/consumed.utils'
import DialogAddProducts from './DialogAddProducts/DialogAddProducts'

interface BoxMealProps {
    index: number
    meal: Consumed[]
    isOwner: boolean
}

const BoxMeal = ({ index, meal, isOwner }: BoxMealProps) => {
    const { t } = useTranslation('nutrition-diary')

    const { proteins, carbs, fats, calories } = useMemo(
        () => sumMacroFromConsumed(meal),
        [meal]
    )

    return (
        <div className="flex w-full flex-col gap-3 rounded border p-3 text-sm">
            <div className="flex justify-center items-center">
                <div className="flex-1">
                    <div className="font-bold">
                        {t('Meal')} {index + 1}
                    </div>
                    <div>
                        {proteins.toFixed(1)}
                        {t('P')} {carbs.toFixed(1)}
                        {t('C')} {fats.toFixed(1)}
                        {t('F')} {calories.toFixed(1)}Kcal
                    </div>
                </div>
                <div>
                    {isOwner ? (
                        <DialogAddProducts mealToAdd={index}>
                            <button
                                className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                                aria-label="Add"
                            >
                                <Plus size={20} />
                            </button>
                        </DialogAddProducts>
                    ) : (
                        <div />
                    )}
                </div>
            </div>
            {meal.map((consumed) => (
                <Fragment key={consumed.id}>
                    <div className="h-[1px] w-full bg-white" />
                    <BoxMealItem
                        consumed={consumed}
                        isOwner={isOwner}
                    />
                </Fragment>
            ))}
        </div>
    )
}

export default BoxMeal
