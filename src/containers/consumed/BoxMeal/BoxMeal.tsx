import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import styled from "styled-components";
import useTranslation from "next-translate/useTranslation";
import { useMemo } from "react";
import BoxMealItem from "@/containers/consumed/BoxMeal/BoxMealItem/BoxMealItem";
import { sumMacroFromConsumed } from "@/utils/consumed.utils";
import DialogAddProducts from "./DialogAddProducts/DialogAddProducts";

const Grid = styled.div`
    width: calc(100% - 24px);
    border: 1px solid #e4e4e4;
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 12px;
    min-height: 50px;
    display: grid;
    grid-template-columns: auto 44px;
    font-size: 0.875rem;
`

const Bolded = styled.div`
    font-weight: bold;
`

const AddButtonContainer = styled.div`
    grid-column: 2;
    grid-row: 1/3;
    width: 100%;
    min-height: 44px;
    height: 100%;
    display: grid;
    margin: auto;
    ${this} div{
        margin: auto;
    }
`

interface BoxMealProps {
    index: number
    meal: Consumed[]
    isOwner: boolean
}

const BoxMeal = ({ index, meal, isOwner }: BoxMealProps) => {
    const { t } = useTranslation('nutrition-diary')

    const {
        proteins,
        carbs,
        fats,
        calories,
    } = useMemo(() => sumMacroFromConsumed(meal), [meal])

    return (
        <Grid>
            <Bolded>{t('Meal')} {index + 1}</Bolded>
            <AddButtonContainer>
                {isOwner
                    ?
                    <DialogAddProducts mealToAdd={index}>
                        <IconButton
                            sx={{ margin: 'auto' }}
                            aria-label="Add"
                            color="primary"
                        >
                            <AddIcon fontSize="small" />
                        </IconButton>
                    </DialogAddProducts>
                    :
                    <div />
                }
            </AddButtonContainer>
            <div>{proteins}{t('P')} {carbs}{t('C')} {fats}{t('F')} {calories}Kcal</div>
            {meal.map(consumed =>
                <BoxMealItem
                    key={consumed.id}
                    consumed={consumed}
                    isOwner={isOwner}
                />
            )}
        </Grid >
    );
};

export default BoxMeal;