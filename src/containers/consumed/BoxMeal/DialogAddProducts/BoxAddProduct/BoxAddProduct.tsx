import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
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
    const [howMany, setHowMany] = useState<number | undefined>(
        product.howMany || 1.0
    )

    const handleHowManyChange = async (howMany: number | undefined) => {
        setHowMany(howMany)
        onValueChange(howMany)
    }

    return (
        <div className="border-left-4 flex w-full flex-row items-center justify-center gap-2 rounded border p-2 text-sm border-l-4">
            <div className="flex-1">
                <div className="font-bold text-primary-dark">
                    {product.name}
                </div>
                <div>
                    <>
                        {product.proteins || 0}
                        {t('P')} {product.carbs || 0}
                        {t('C')} {product.fats || 0}
                        {t('F')} {getCalories(product)}kcal
                    </>
                </div>
            </div>
            <DialogShowProduct product={product}>
                <div>
                    <IconButton>
                        <Info size={20} className="text-[#90caf9]" />
                    </IconButton>
                </div>
            </DialogShowProduct>
            <TextField
                type="number"
                value={howMany}
                onChange={(e) =>
                    handleHowManyChange(
                        e.target.value ? Number(e.target.value) : undefined
                    )
                }
                inputProps={{
                    inputMode: 'numeric',
                    pattern: '[0-9]*',
                }}
                className="max-w-[52px]"
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
