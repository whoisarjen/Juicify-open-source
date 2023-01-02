import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import styled from 'styled-components';
import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { getCalories } from '@/utils/consumed.utils';
import DialogShowProduct from './DialogShowProduct/DialogShowProduct'

const Grid = styled.div`
    display: grid;
    grid-template-columns: 1fr 30px 40px 50px 40px;
    margin-bottom: 10px;
    border: 1px solid #e4e4e4;
    border-left: 5px solid #e4e4e4;
    border-radius: 8px;
    padding: 10px 5px 10px 15px;
    width: calc(100% - 26px);
    font-size: 0.875rem;
`

const Name = styled.div`
    grid-column: 1;
    margin-top: auto;
    font-weight: bold;
`

const Description = styled.div`
    grid-column: 1;
    margin-bottom: auto;
`

const MoreInfo = styled.div`
    grid-column: 3;
    grid-row: 1 / 3;
    margin: auto;
`

const Value = styled.div`
    grid-column: 4;
    grid-row: 1 / 3;
    margin: auto;
`

const Submit = styled.div`
    grid-column: 5;
    grid-row: 1 / 3;
    margin: auto;
`

interface BoxProductProps {
    product: Product & { howMany?: number }
    isChecked: boolean
    onCheckClick: () => void
    onValueChange: (howMany: number | undefined) => void
    mealToAdd: number
}

const BoxAddProduct = ({
    product,
    isChecked,
    onCheckClick,
    onValueChange,
    mealToAdd,
}: BoxProductProps) => {
    const { t } = useTranslation('nutrition-diary');
    const [howMany, setHowMany] = useState<number | undefined>(product.howMany || 1.0)
    const { getTheme } = useTheme()

    const handleHowManyChange = async (howMany: number | undefined) => {
        setHowMany(howMany)
        onValueChange(howMany)
    }

    return (
        <Grid style={{ borderLeft: product.isVerified ? `5px solid ${getTheme('PRIMARY')}` : '' }}>
            <Name style={{ color: getTheme('PRIMARY') }}>
                {product.name}
            </Name>
            <Description>
                <>{(product.proteins || 0)}{t('P')} {(product.carbs || 0)}{t('C')} {(product.fats || 0)}{t('F')} {getCalories(product)}kcal</>
            </Description>
            <div />
            <DialogShowProduct product={product} mealToAdd={mealToAdd}>
                <MoreInfo>
                    <IconButton color="primary">
                        <InfoIcon fontSize="small" />
                    </IconButton>
                </MoreInfo>
            </DialogShowProduct>
            <Value>
                <TextField
                    type="number"
                    value={howMany}
                    onChange={(e) => handleHowManyChange(e.target.value ? Number(e.target.value) : undefined)}
                    inputProps={{
                        inputMode: 'numeric',
                        pattern: '[0-9]*',
                    }}
                />
            </Value>
            <Submit onChange={onCheckClick}>
                <Checkbox
                    data-testid="checked"
                    checked={isChecked}
                    inputProps={{ 'aria-label': 'controlled' }}
                />
            </Submit>
        </Grid>
    );
}

export default BoxAddProduct;