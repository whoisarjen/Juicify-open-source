import { useAppDispatch } from "@/hooks/useRedux";
import { setIsDialogEditConsumed, setSelectedConsumed } from "@/redux/features/dialogEditConsumed.slice";
import { getCaloriesFromProduct } from "@/utils/consumed.utils";
import EditIcon from "@mui/icons-material/Edit";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import IconButton from '@mui/material/IconButton';
import useTranslation from "next-translate/useTranslation";
import styled from "styled-components";

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
    const dispatch = useAppDispatch()
    const { product } = consumed

    const handleDialogEditConsumed = () => {
        dispatch(setSelectedConsumed(consumed))
        dispatch(setIsDialogEditConsumed(true))
    }

    return (
        <Product>

            <EditButtonContainer>
                {isOwner
                    ? <IconButton aria-label="edit" onClick={handleDialogEditConsumed}>
                        <EditIcon fontSize="small" />
                    </IconButton>
                    : <IconButton aria-label="edit">
                        <FastfoodIcon fontSize="small" />
                    </IconButton>
                }
            </EditButtonContainer>

            <ProductContent>
                <div>{product.name}</div>
                <div>{getCaloriesFromProduct(product)}kcal</div>
            </ProductContent>
            <ProductContent>
                <>
                    <div>{product.proteins}{t('P')} {product.carbs}{t('C')} {product.fats}{t('F')}</div>
                    <div>{Number(consumed.howMany) * 100}g/ml</div>
                </>
            </ProductContent>

        </Product>
    )
}

export default BoxMealItem;