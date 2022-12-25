import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import styled from "styled-components";
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { useState, SyntheticEvent, useMemo, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { buildStyles } from 'react-circular-progressbar';
import DiagramCircular from '../../../components/DiagramCircular/DiagramCircular';
import { useDailyByWhenAndUsernameQuery } from '@/generated/graphql';
import { getExpectedMacro, getConsumedMacro } from '@/utils/consumed.utils'

const Table = styled.table`
    font-size: 0.875rem;
    text-align: left;
    ${this} td{
        text-align: right;
    }
    ${this} tr td:first-of-type{
        font-weight: bold;
    }
`

const DiagramConsumedRemaining = () => {
    const [value, setValue] = useState<string>('1')
    const { t } = useTranslation('nutrition-diary')
    const { getTheme } = useTheme()
    const router: any = useRouter()
    const when = router?.query?.date
    const username = router?.query?.login
    const [{ data, fetching }, getDailyByWhenAndUsername] = useDailyByWhenAndUsernameQuery({
        variables: {
            when,
            username,
        },
        pause: true,
    })

    const { consumedMacro, expectedMacro } = useMemo(() => {
        return {
            consumedMacro: getConsumedMacro(data?.consumedByWhenAndUsername),
            expectedMacro: getExpectedMacro(data?.userByUsername, when),
        }
    }, [data?.consumedByWhenAndUsername, data?.userByUsername, fetching])

    const burnedCalories = useMemo(() => {
        return data?.workoutResultsByWhen?.reduce((prev, now) => {
            return prev + (now?.burnedCalories || 0)
        }, 0) || 0
    }, [data?.workoutResultsByWhen, fetching])

    useEffect(() => {
        when && username && getDailyByWhenAndUsername()
    }, [when, username])

    const styles = useMemo(() => buildStyles({
        pathTransitionDuration: 0.5,
        pathColor: getTheme('PRIMARY'),
        textColor: 'rgba(122, 122, 122, 1',
        trailColor: '#d6d6d6',
        backgroundColor: getTheme('PRIMARY'),
    }), [getTheme])

    return (
        <Box sx={{ width: '100%', display: 'grid', marginBottom: '24px' }}>
            <TabContext value={value}>
                <Box>
                    <TabList
                        onChange={(_event: SyntheticEvent, newValue: string) => setValue(newValue)}
                        value={value}
                        indicatorColor="primary"
                        textColor="inherit"
                        variant="fullWidth"
                        sx={{ marginBottom: '24px' }}
                    >
                        <Tab label={t('consumed')} value="1" key={1} />
                        <Tab label={t('remaining')} value="2" key={2} />
                    </TabList>
                </Box>
                <TabPanel value="1" sx={{ width: '100%', display: 'grid', gridTemplateColumns: 'calc(50% - 12px) 12px auto', padding: '0 !important' }}>
                    <div>
                        <DiagramCircular
                            text={`${(consumedMacro.calories - burnedCalories)}${t('Kcal')}`}
                            value={(consumedMacro.calories - burnedCalories) / expectedMacro.calories * 100}
                            styles={styles}
                        />
                    </div>
                    <div />
                    <Table>
                        <tbody>
                            <tr>
                                <th>Proteins:</th>
                                <td>{(consumedMacro.proteins).toFixed(process.env.PRODUCT_DECIMAL_PLACES as unknown as number)}g</td>
                                <td>{expectedMacro.proteins}g</td>
                            </tr>
                            <tr>
                                <th>Carbs:</th>
                                <td>{(consumedMacro.carbs).toFixed(process.env.PRODUCT_DECIMAL_PLACES as unknown as number)}g</td>
                                <td>{expectedMacro.carbs}g</td>
                            </tr>
                            <tr>
                                <th>Sugar:</th>
                                <td>{(consumedMacro.sugar / (consumedMacro.carbs === 0 ? 1 : consumedMacro.carbs) * 100).toFixed(process.env.PRODUCT_DECIMAL_PLACES as unknown as number)}%</td>
                                <td>{expectedMacro.carbsPercentAsSugar}%</td>
                            </tr>
                            <tr>
                                <th>Fats:</th>
                                <td>{(consumedMacro.fats).toFixed(process.env.PRODUCT_DECIMAL_PLACES as unknown as number)}g</td>
                                <td>{expectedMacro.fats}g</td>
                            </tr>
                            <tr>
                                <th>Fiber:</th>
                                <td>{(consumedMacro.fiber).toFixed(process.env.PRODUCT_DECIMAL_PLACES as unknown as number)}g</td>
                                <td>{expectedMacro.fiber}g</td>
                            </tr>
                        </tbody>
                    </Table>
                </TabPanel>
                <TabPanel value="2" sx={{ width: '100%', display: 'grid', gridTemplateColumns: 'calc(50% - 12px) 12px auto', padding: '0 !important' }}>
                    <div>
                        <DiagramCircular
                            text={`${expectedMacro.calories - consumedMacro.calories + burnedCalories}${t('Kcal')}`}
                            value={(expectedMacro.calories - consumedMacro.calories + burnedCalories) / expectedMacro.calories * 100}
                            styles={styles}
                        />
                    </div>
                    <div />
                    <Table>
                        <tbody>
                            <tr>
                                <th>Proteins:</th>
                                <td>{(expectedMacro.proteins - consumedMacro.proteins).toFixed(process.env.PRODUCT_DECIMAL_PLACES as unknown as number)}g</td>
                                <td>{expectedMacro.proteins}g</td>
                            </tr>
                            <tr>
                                <th>Carbs:</th>
                                <td>{(expectedMacro.carbs - consumedMacro.carbs).toFixed(process.env.PRODUCT_DECIMAL_PLACES as unknown as number)}g</td>
                                <td>{expectedMacro.carbs}g</td>
                            </tr>
                            <tr>
                                <th>Sugar:</th>
                                <td>{(expectedMacro.carbsPercentAsSugar - (consumedMacro.sugar / (consumedMacro.carbs === 0 ? 1 : consumedMacro.carbs) * 100)).toFixed(process.env.PRODUCT_DECIMAL_PLACES as unknown as number)}%</td>
                                <td>{expectedMacro.carbsPercentAsSugar}%</td>
                            </tr>
                            <tr>
                                <th>Fats:</th>
                                <td>{(expectedMacro.fats - consumedMacro.fats).toFixed(process.env.PRODUCT_DECIMAL_PLACES as unknown as number)}g</td>
                                <td>{expectedMacro.fats}g</td>
                            </tr>
                            <tr>
                                <th>Fiber:</th>
                                <td>{(expectedMacro.fiber - consumedMacro.fiber).toFixed(process.env.PRODUCT_DECIMAL_PLACES as unknown as number)}g</td>
                                <td>{expectedMacro.fiber}g</td>
                            </tr>
                        </tbody>
                    </Table>
                </TabPanel>
            </TabContext>
        </Box>
    )
}

export default DiagramConsumedRemaining;