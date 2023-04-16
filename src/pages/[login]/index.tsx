import NavbarProfile from '@/containers/profile/NavbarProfile/NavbarProfile'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import moment from 'moment'
import { getCalories, multipleProductByHowMany } from '@/utils/consumed.utils'
import { StackedBarChart } from '@/components/StackedBarChart'
import { SimpleLineChart } from '@/components/SimpleLineChart'
import useDaily from '@/hooks/useDaily'
import { range } from 'lodash'

const NUMBER_OF_SUPPORTED_DAYS = 7

const startDate = moment()
    .add(-NUMBER_OF_SUPPORTED_DAYS, 'd')
    .format('YYYY-MM-DD')
const endDate = moment().format('YYYY-MM-DD')

const ProfilePage = () => {
    const { t } = useTranslation('profile')
    const router = useRouter()

    const username = router.query.login as string

    const barNamesWithColor = [
        { dataKey: t('p'), fill: '#ff8b42' },
        { dataKey: t('c'), fill: '#ffbb33' },
        { dataKey: t('f'), fill: '#90c253' },
    ]

    const barNamesWithColorCalories = [
        { dataKey: t('Calories'), stroke: '#ff8b42' },
        { dataKey: t('Burnt'), stroke: '#b1272f' },
        { dataKey: t('Diffrent'), stroke: '#90caf9' },
    ]

    const { consumed, workoutResults, burnedCalories } = useDaily({
        username,
        startDate,
        endDate,
    })

    const { dataCalories, dataMacronutrients } = useMemo(() => {
        const defaultData = range(NUMBER_OF_SUPPORTED_DAYS).map((_, index) => ({
            name: moment().add(-index, 'd').format('DD.MM'),
            when: moment().add(-index, 'd').format('YYYY-MM-DD'),
            [t('Calories')]: 0,
            [t('Burnt')]: 0,
            [t('Diffrent')]: 0,
        }))

        const defaultMacro = range(NUMBER_OF_SUPPORTED_DAYS).map(() => ({
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

        consumed.forEach((consumed) => {
            const index = defaultData.findIndex(
                (x) =>
                    moment(x.when).format('YYYY-MM-DD') ===
                    moment(consumed.whenAdded).format('YYYY-MM-DD')
            )
            const { product } = multipleProductByHowMany(consumed)

            defaultData[index] = {
                ...defaultData[index],
                [t('Calories')]:
                    (defaultData[index][t('Calories')] as number) +
                    getCalories(product),
            }
            defaultMacro[index] = {
                ...defaultMacro[index],
                [t('p')]:
                    defaultMacro[index][t('p')] + Number(product.proteins),
                [t('c')]: defaultMacro[index][t('c')] + Number(product.carbs),
                [t('f')]: defaultMacro[index][t('f')] + Number(product.fats),
            }
        })

        burnedCalories
            .concat(workoutResults)
            .forEach(({ whenAdded, burnedCalories }) => {
                const index = defaultData.findIndex(
                    (x) =>
                        moment(x.when).format('YYYY-MM-DD') ===
                        moment(whenAdded).format('YYYY-MM-DD')
                )

                defaultData[index] = {
                    ...defaultData[index],
                    [t('Burnt')]:
                        ((defaultData[index]?.[t('Burnt')] || 0) as number) +
                        burnedCalories,
                }
            })

        return {
            dataCalories: defaultData.reverse(),
            dataMacronutrients: defaultMacro.reverse(),
        }
    }, [consumed, t, workoutResults, burnedCalories])

    return (
        <div className="flex flex-1 flex-col">
            <NavbarProfile tab={0} />
            <h3 className="text-primary-dark">{t('Daily calories')}</h3>
            <div className="min-h-96 flex h-96 max-h-96">
                <SimpleLineChart
                    data={dataCalories}
                    barNamesWithColor={barNamesWithColorCalories}
                />
            </div>
            <h3 className="text-primary-dark">{t('Daily macronutrients')}</h3>
            <div className="min-h-96 flex h-96 max-h-96">
                <StackedBarChart
                    data={dataMacronutrients}
                    barNamesWithColor={barNamesWithColor}
                />
            </div>
        </div>
    )
}

export default ProfilePage
