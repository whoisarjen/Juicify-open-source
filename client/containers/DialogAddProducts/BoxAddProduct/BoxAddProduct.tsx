import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import styled from 'styled-components';
import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react';
import { useTheme } from '../../../hooks/useTheme';
import { useAppDispatch } from '@/hooks/useRedux';
import { addToChecked, changeChecked, removeFromChecked } from '@/redux/features/dialogAddProducts.slice';
import { setIsDialogShowProduct, setSelectedProduct } from '@/redux/features/dialogShowProduct.slice';
import { getCaloriesFromProduct } from '@/utils/consumed.utils';

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

const Favourite = styled.div`
    grid-column: 2;
    grid-row: 1 / 3;
    margin: auto;
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
    product: Product
    isChecked: boolean
}

const BoxAddProduct = ({
    product,
    isChecked,
}: BoxProductProps) => {
    const { t } = useTranslation('nutrition-diary');
    const [checked, setChecked] = useState(isChecked);
    const [value, setValue] = useState('1.0')
    const { getTheme } = useTheme()
    const dispatch = useAppDispatch()

    const handleCheck = async () => {
        if (checked) {
            setChecked(false)
            dispatch(removeFromChecked(product))
        } else {
            setChecked(true)
            dispatch(addToChecked({ ...product, howMany: value }))
        }
    }

    const handleValueChange = async (value: any) => {
        setValue(value)
        dispatch(changeChecked({ ...product, howMany: value }))
    }

    const handleDialogShowProduct = () => {
        dispatch(setSelectedProduct(product))
        dispatch(setIsDialogShowProduct(true))
    }

    return (
        <Grid style={{ borderLeft: product.isVerified ? `5px solid ${getTheme('PRIMARY')}` : '' }}>
            <Name style={{ color: getTheme('PRIMARY') }}>
                {product.name}
            </Name>
            <Description>
                {(product.proteins || 0)}{t('P')} {(product.carbs || 0)}{t('C')} {(product.fats || 0)}{t('F')} {getCaloriesFromProduct(product)}kcal
            </Description>
            <div />
            <MoreInfo onClick={handleDialogShowProduct} data-testid="handleDialogShowProduct">
                <IconButton color="primary">
                    <InfoIcon fontSize="small" />
                </IconButton>
            </MoreInfo>
            <Value>
                <TextField type="number" value={value} onChange={(e) => handleValueChange(e.target.value)} inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />
            </Value>
            <Submit onChange={handleCheck}>
                <Checkbox
                    data-testid="checked"
                    checked={checked}
                    inputProps={{ 'aria-label': 'controlled' }}
                />
            </Submit>
        </Grid>
    );
}

export default BoxAddProduct;