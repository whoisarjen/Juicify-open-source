import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import styled from "styled-components"
import useTranslation from 'next-translate/useTranslation'
import { useState } from 'react'
import DiagramCircular from '../../../components/DiagramCircular/DiagramCircular'
import useDaily from '@/hooks/useDaily'

const Table = styled.table`
    font-size: 0.875rem
    text-align: left
    ${this} td{
        text-align: right
    }
    ${this} tr td:first-of-type{
        font-weight: bold
    }
`

const DiagramConsumedRemaining = () => {
    const [value, setValue] = useState('1')
    const { t } = useTranslation('nutrition-diary')
    const {
        consumedMacro,
        expectedMacro,
        burnedCalories,
    } = useDaily()

    return (
        <Box
            sx={{
                width: '100%',
                display: 'grid',
                marginBottom: '24px',
            }}
        >
            <TabContext value={value}>
                <Box>
                    <TabList
                        onChange={(_, newValue: string) => setValue(newValue)}
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
                <TabPanel
                    value="1"
                    sx={{
                        width: '100%',
                        display: 'grid',
                        padding: '0 !important',
                        gridTemplateColumns: 'calc(50% - 12px) 12px auto',
                    }}
                >
                    <div>
                        <DiagramCircular
                            text={`${(consumedMacro.calories - burnedCalories)}${t('Kcal')}`}
                            value={(consumedMacro.calories - burnedCalories) / expectedMacro.calories * 100}
                        />
                    </div>
                    <div />
                    <Table>
                        <tbody>
                            <tr>
                                <th>Proteins:</th>
                                <td>{(consumedMacro.proteins)}g</td>
                                <td>{expectedMacro.proteins}g</td>
                            </tr>
                            <tr>
                                <th>Carbs:</th>
                                <td>{(consumedMacro.carbs)}g</td>
                                <td>{expectedMacro.carbs}g</td>
                            </tr>
                            <tr>
                                <th>Sugar:</th>
                                <td>{(consumedMacro.sugar / (consumedMacro.carbs === 0 ? 1 : consumedMacro.carbs) * 100)}g</td>
                                <td>{expectedMacro.sugar}g</td>
                            </tr>
                            <tr>
                                <th>Fats:</th>
                                <td>{(consumedMacro.fats)}g</td>
                                <td>{expectedMacro.fats}g</td>
                            </tr>
                            <tr>
                                <th>Fiber:</th>
                                <td>{(consumedMacro.fiber)}g</td>
                                <td>{expectedMacro.fiber}g</td>
                            </tr>
                        </tbody>
                    </Table>
                </TabPanel>
                <TabPanel
                    value="2"
                    sx={{
                        width: '100%',
                        display: 'grid',
                        padding: '0 !important',
                        gridTemplateColumns: 'calc(50% - 12px) 12px auto',
                    }}
                >
                    <div>
                        <DiagramCircular
                            text={`${expectedMacro.calories - consumedMacro.calories + burnedCalories}${t('Kcal')}`}
                            value={(expectedMacro.calories - consumedMacro.calories + burnedCalories) / expectedMacro.calories * 100}
                        />
                    </div>
                    <div />
                    <Table>
                        <tbody>
                            <tr>
                                <th>Proteins:</th>
                                <td>{(expectedMacro.proteins - consumedMacro.proteins)}g</td>
                                <td>{expectedMacro.proteins}g</td>
                            </tr>
                            <tr>
                                <th>Carbs:</th>
                                <td>{(expectedMacro.carbs - consumedMacro.carbs)}g</td>
                                <td>{expectedMacro.carbs}g</td>
                            </tr>
                            <tr>
                                <th>Sugar:</th>
                                <td>{(expectedMacro.sugar - (consumedMacro.sugar / (consumedMacro.carbs === 0 ? 1 : consumedMacro.carbs) * 100))}g</td>
                                <td>{expectedMacro.sugar}g</td>
                            </tr>
                            <tr>
                                <th>Fats:</th>
                                <td>{(expectedMacro.fats - consumedMacro.fats)}g</td>
                                <td>{expectedMacro.fats}g</td>
                            </tr>
                            <tr>
                                <th>Fiber:</th>
                                <td>{(expectedMacro.fiber - consumedMacro.fiber)}g</td>
                                <td>{expectedMacro.fiber}g</td>
                            </tr>
                        </tbody>
                    </Table>
                </TabPanel>
            </TabContext>
        </Box>
    )
}

export default DiagramConsumedRemaining