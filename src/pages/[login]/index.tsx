import NavbarProfile from "@/containers/profile/NavbarProfile/NavbarProfile";
import { useTheme } from "@/hooks/useTheme";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useMemo } from "react";
import moment from "moment";
import { getCalories, multipleProductByHowMany } from "@/utils/consumed.utils";
import styled from 'styled-components'
import { trpc } from "@/utils/trpc";
import { StackedBarChart } from '@/components/StackedBarChart'
import { SimpleLineChart } from '@/components/SimpleLineChart'

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

    const username = router.query.login || ''
    const startDate = moment().add(-7, 'd').format('YYYY-MM-DD')
    const endDate = moment().format('YYYY-MM-DD')

    const [
        { data: consumed },
        { data: workoutResults },
    ] = trpc.useQueries(t => [
        t
            .consumed
            .getPeriod({ username, startDate, endDate }),
        t
            .workoutResult
            .getPeriod({ username, startDate, endDate }),
    ])

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

        if (!consumed || !workoutResults) {
            return {
                dataCalories: defaultData.reverse(),
                dataMacronutrients: defaultMacro,
            }
        }

        consumed.forEach(consumed => {
            if (consumed) {
                const index = defaultData.findIndex(x =>
                    moment(x.when).format('YYYY-MM-DD') === moment(consumed.whenAdded).format('YYYY-MM-DD'))
                const { product } = multipleProductByHowMany(consumed)

                defaultData[index] = {
                    ...defaultData[index],
                    [t('Calories')]: defaultData[index][t('Calories')] as number + getCalories(product),
                }
                defaultMacro[index] = {
                    ...defaultMacro[index],
                    [t('p')]: defaultMacro[index][t('p')] + Number(product.proteins),
                    [t('c')]: defaultMacro[index][t('c')] + Number(product.carbs),
                    [t('f')]: defaultMacro[index][t('f')] + Number(product.fats),
                }
            }
        })

        workoutResults.forEach(workoutResult => {
            const index = defaultData.findIndex(x =>
                moment(x.when).format('YYYY-MM-DD') === moment(workoutResult.whenAdded).format('YYYY-MM-DD'))

            defaultData[index] = {
                ...defaultData[index],
                [t('Burnt')]: (defaultData[index]?.[t('Burnt')] || 0) as number + workoutResult.burnedCalories,
            }
        })

        return {
            dataCalories: defaultData.reverse(),
            dataMacronutrients: defaultMacro.reverse(),
        }
    }, [consumed, t, workoutResults])

    return (
        <>
            <NavbarProfile tab={0} />
            <h3 style={{ color: getTheme('PRIMARY') }}>{t('Daily calories')}</h3>
            <Box>
                <SimpleLineChart data={dataCalories} barNamesWithColor={barNamesWithColorCalories} />
            </Box>
            <h3 style={{ color: getTheme('PRIMARY') }}>{t("Daily macronutrients")}</h3>
            <Box>
                <StackedBarChart
                    data={dataMacronutrients}
                    barNamesWithColor={barNamesWithColor}
                />
            </Box>
        </>
    );
};

export default ProfilePage;