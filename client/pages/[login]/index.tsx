import SimpleLineChart from "@/components/common/diagram-simple-line-chart";
import NavbarProfile from "@/containers/profile/NavbarProfile/NavbarProfile";
import { useTheme } from "@/hooks/useTheme";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { ConsumedFieldsFragment, useDailiesByRangeAndUsernameQuery, WorkoutResultFieldsFragment } from '@/generated/graphql'
import moment from "moment";
import { getCaloriesFromProduct, multipleConsumedProductByHowMany } from "@/utils/consumed.utils";
import StackedBarChart from "@/components/common/diagram-stacked-bar-chart";
import styled from 'styled-components'

const Box = styled.div`
    width: 100%;
    max-height: 390px;
    min-height: 390px;
    padding-bottom: 30px;
`

const ProfilePage = () => {
    const { getTheme } = useTheme()
    const { t } = useTranslation('profile')
    const router: any = useRouter()

    const barNamesWithColor = [
        { dataKey: t('p'), fill: '#ff8b42' },
        { dataKey: t('c'), fill: '#ffbb33' },
        { dataKey: t('f'), fill: '#90c253' }
    ]

    const barNamesWithColorCalories = [
        { dataKey: t('Calories'), stroke: '#ff8b42' },
        { dataKey: t('Burnt'), stroke: '#b1272f' },
        { dataKey: t('Diffrent'), stroke: getTheme('PRIMARY') }
    ]

    const [{ data }, getDailiesByRangeAndUsername] = useDailiesByRangeAndUsernameQuery({
        variables: {
            username: router?.query?.login,
            startDate: moment().add(-7, 'd').format('YYYY-MM-DD'),
            endDate: moment().format('YYYY-MM-DD'),
        }
    })

    useEffect(() => {
        router?.query?.login && getDailiesByRangeAndUsername()
    }, [router?.query?.login])

    const {
        dataCalories,
        dataMacronutrients,
    } = useMemo(() => {
        const defaultData = [...Array(7)].map((_, index) => ({
            name: moment().add(-index, 'd').format('DD.MM'),
            when: moment().add(-index, 'd').format('YYYY-MM-DD'),
            [t('Calories')]: 0,
            [t('Burnt')]: 0,
            [t('Diffrent')]: 0
        }))
        const defaultMacro = [...Array(7)].map(() => ({
            [t('p')]: 0,
            [t('c')]: 0,
            [t('f')]: 0,
        }))

        if (!data?.consumedByRangeAndUsername) {
            return {
                dataCalories: defaultData.reverse(),
                dataMacronutrients: defaultMacro,
            }
        }

        data?.consumedByRangeAndUsername?.forEach((consumed: ConsumedFieldsFragment | null) => {
            if (consumed) {
                const index = defaultData.findIndex(x => x.when == consumed?.when)
                const multipledProduct = multipleConsumedProductByHowMany(consumed).product
                defaultData[index] = {
                    ...defaultData[index],
                    [t('Calories')]: defaultData[index][t('Calories')] as number + getCaloriesFromProduct(
                        multipledProduct
                    ),
                }
                defaultMacro[index] = {
                    ...defaultMacro[index],
                    [t('p')]: defaultMacro[index][t('p')] + multipledProduct.proteins,
                    [t('c')]: defaultMacro[index][t('c')] + multipledProduct.carbs,
                    [t('f')]: defaultMacro[index][t('f')] + multipledProduct.fats,
                }
            }
        })

        data?.workoutResultsByRangeAndUsername?.forEach((workoutResult: WorkoutResultFieldsFragment | null) => {
            if (workoutResult) {
                const index = defaultData.findIndex(x => x.when == workoutResult?.when)
                defaultData[index] = {
                    ...defaultData[index],
                    [t('Burnt')]: (defaultData[index]?.[t('Burnt')] || 0) as number + workoutResult.burnedCalories,
                }
            }
        })

        return {
            dataCalories: defaultData.reverse(),
            dataMacronutrients: defaultMacro.reverse(),
        }
    }, [data?.consumedByRangeAndUsername])

    return (
        <>
            <NavbarProfile tab={0} />
            <h3 style={{ color: getTheme('PRIMARY') }}>{t('Daily calories')}</h3>
            <Box>
                <SimpleLineChart data={dataCalories} barNamesWithColor={barNamesWithColorCalories} />
            </Box>
            <h3 style={{ color: getTheme('PRIMARY') }}>{t("Daily macronutrients")}</h3>
            <Box>
                <StackedBarChart data={dataMacronutrients} barNamesWithColor={barNamesWithColor} />
            </Box>
        </>
    );
};

export default ProfilePage;