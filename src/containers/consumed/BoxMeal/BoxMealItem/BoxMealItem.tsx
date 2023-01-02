import { useAppDispatch } from "@/hooks/useRedux";
import { getCalories, multipleProductByHowMany } from "@/utils/consumed.utils";
import EditIcon from "@mui/icons-material/Edit";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import IconButton from '@mui/material/IconButton';
import useTranslation from "next-translate/useTranslation";
import styled from "styled-components";
import DialogEditConsumed from '@/containers/DialogEditConsumed/DialogEditConsumed'

const Product = styled.div`
    width: 100%;
    min-height: 50px;
    border-top: 1px solid #e4e4e4;
    margin-top: 10px;
    padding: 15px 0 5px;
    display: grid;
    grid-template-columns: 44px auto;
    grid-column: 1 / 3;
`

const EditButtonContainer = styled.div`
    margin: auto;
    grid-row: 1 / 3;
`

const ProductContent = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: 1fr auto;
    ${this}:nth-child(2) div {
    font-weight: bold;
    margin-top: auto;
`

interface BoxMealItemProps {
    consumed: Consumed
    isOwner: boolean
}

const BoxMealItem = ({ consumed, isOwner }: BoxMealItemProps) => {
    const { t } = useTranslation('nutrition-diary')
    const { product } = multipleProductByHowMany(consumed)

    return (
        <Product>
            <EditButtonContainer>
                {isOwner
                    ?
                    <DialogEditConsumed consumed={consumed}>
                        <IconButton aria-label="edit">
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </DialogEditConsumed>
                    : <IconButton aria-label="edit">
                        <FastfoodIcon fontSize="small" />
                    </IconButton>
                }
            </EditButtonContainer>
            <ProductContent>
                <div>{product.name}</div>
                <div>{getCalories(product)}kcal</div>
            </ProductContent>
            <ProductContent>
                <>
                    <div>{Number(product.proteins)}{t('P')} {Number(product.carbs)}{t('C')} {Number(product.fats)}{t('F')}</div>
                    <div>{Number(consumed.howMany) * 100}g/ml</div>
                </>
            </ProductContent>
        </Product>
    )
}

export default BoxMealItem;