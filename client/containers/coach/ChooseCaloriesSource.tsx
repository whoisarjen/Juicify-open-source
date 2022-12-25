import Button from '@mui/material/Button';
import useTranslation from "next-translate/useTranslation";
import styled from "styled-components";
import { useAppSelector } from '../../hooks/useRedux';
import NavbarOnlyTitle from '@/components/NavbarOnlyTitle/NavbarOnlyTitle';

interface ChooseCaloriesSourcetProps {
    prepareAnalize: (arg0: boolean) => void
}

const Grid = styled.div`
    width: 100%;
    height: calc(100vh - var(--BothNavHeightAndPadding));
    display: grid;
    grid-template-rows: auto auto auto 40px 40px;
    grid-gap: 5px;
    text-align: center;
`

const Bold = styled.div`
    font-weight: bold;
    text-transform: uppercase;
    font-size: 0.9rem;
`

const GridContent = styled.div`
    width: 100%;
    height: 100%;
    display: grid;
`

const ChooseCaloriesSource = ({ prepareAnalize }: ChooseCaloriesSourcetProps) => {
    // const { t } = useTranslation('coach')
    // const token: any = useAppSelector(state => state.token.value)
    // const { data }: any = useDailyMeasurements(addDaysToDate(getShortDate(), -1), 7, token.login)

    // const getAvgCaloriesFromDaily = () => {
    //         let calories = 0;
    //         if (data) {
    //             data.forEach((day: any) => {
    //                 day.nutrition_diary.forEach((nutrition: any) => {
    //                     calories += getCalories(nutrition)
    //                 })
    //             })
    //         }
    //         return calories / 7;
    // }

    // const getAvgCaloriesFromToken = () => {
    //         let calories = 0;
    //         if (token) {
    //             token.macronutrients.forEach((day: any) => {
    //                 calories += day.proteins * 4 + day.carbs * 4 + day.fats * 9;
    //             })
    //         }
    //         return calories / 7;
    // }

    return (
        <Grid>
            {/* <NavbarOnlyTitle title="coach:CHOOSE_CALORIES_SOURCE_TITLE" />
            <GridContent>
                <Bold>{t('CHOOSE_CALORIES_SOURCE_BUTTON')}</Bold>
                <div>{t('CHOOSE_CALORIES_SOURCE_DESCRIPTION')}:</div>
                <div>~{Math.round(getAvgCaloriesFromDaily())}kcal/day</div>
            </GridContent>
            <GridContent>
                <Bold>{t('CHOOSE_CALORIES_SOURCE_BUTTON_2')}</Bold>
                <div>{t('CHOOSE_CALORIES_SOURCE_DESCRIPTION_2')}:</div>
                <div>~{Math.round(getAvgCaloriesFromToken())}kcal/day</div>
            </GridContent>
            <Button variant="contained" onClick={() => prepareAnalize(true)}>{t('CHOOSE_CALORIES_SOURCE_BUTTON')}</Button>
            <Button variant="contained" onClick={() => prepareAnalize(false)}>{t('CHOOSE_CALORIES_SOURCE_BUTTON_2')}</Button> */}
        </Grid>
    );
};

export default ChooseCaloriesSource;