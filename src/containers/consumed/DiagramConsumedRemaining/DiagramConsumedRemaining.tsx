import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import useTranslation from 'next-translate/useTranslation'
import { useState } from 'react'
import DiagramCircular from '../../../components/DiagramCircular/DiagramCircular'
import useDaily from '@/hooks/useDaily'

interface DiagramConsumedRemainingProps {
    username: string
    startDate: string
    endDate: string
}

const DiagramConsumedRemaining = (props: DiagramConsumedRemainingProps) => {
    const [value, setValue] = useState('1')
    const { t } = useTranslation('nutrition-diary')
    const { consumedMacro, expectedMacro, burnedCaloriesSum } = useDaily(props)

    return (
        <Box
            sx={{
                width: '100%',
                display: 'grid',
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
                        display: 'flex',
                        padding: '0 !important',
                    }}
                >
                    <DiagramCircular
                        text={`${consumedMacro.calories - burnedCaloriesSum}${t(
                            'Kcal'
                        )}`}
                        value={
                            ((consumedMacro.calories - burnedCaloriesSum) /
                                expectedMacro.calories) *
                            100
                        }
                    />
                    <div className="flex w-full flex-1 text-sm">
                        <div className="flex w-full flex-1 flex-col">
                            <div className="flex">
                                <span className="flex-1 text-left">Proteins:</span>
                                <span className="w-12 text-right font-bold">
                                    {consumedMacro.proteins}g
                                </span>
                                <span className="flex-1 text-right">
                                    {expectedMacro.proteins}g
                                </span>
                            </div>
                            <div className="flex">
                                <span className="flex-1 text-left">Carbs:</span>
                                <span className="w-12 text-right font-bold">
                                    {consumedMacro.carbs}g
                                </span>
                                <span className="flex-1 text-right">
                                    {expectedMacro.carbs}g
                                </span>
                            </div>
                            <div className="flex">
                                <span className="flex-1 text-left">Sugar:</span>
                                <span className="w-12 text-right font-bold">
                                    {consumedMacro.sugar}g
                                </span>
                                <span className="flex-1 text-right">
                                    {expectedMacro.sugar}g
                                </span>
                            </div>
                            <div className="flex">
                                <span className="flex-1 text-left">Fats:</span>
                                <span className="w-12 text-right font-bold">
                                    {consumedMacro.fats}g
                                </span>
                                <span className="flex-1 text-right">
                                    {expectedMacro.fats}g
                                </span>
                            </div>
                            <div className="flex">
                                <span className="flex-1 text-left">Fiber:</span>
                                <span className="w-12 text-right font-bold">
                                    {consumedMacro.fiber}g
                                </span>
                                <span className="flex-1 text-right">
                                    {expectedMacro.fiber}g
                                </span>
                            </div>
                        </div>
                    </div>
                </TabPanel>
                <TabPanel
                    value="2"
                    sx={{
                        width: '100%',
                        display: 'flex',
                        padding: '0 !important',
                    }}
                >
                    <DiagramCircular
                        text={`${
                            expectedMacro.calories -
                            consumedMacro.calories +
                            burnedCaloriesSum
                        }${t('Kcal')}`}
                        value={
                            ((expectedMacro.calories -
                                consumedMacro.calories +
                                burnedCaloriesSum) /
                                expectedMacro.calories) *
                            100
                        }
                    />
                    <div className="flex w-full flex-1 text-sm">
                        <div className="flex w-full flex-1 flex-col">
                            <div className="flex">
                                <span className="flex-1 text-left">Proteins:</span>
                                <span className="w-12 text-right font-bold">
                                    {expectedMacro.proteins -
                                        consumedMacro.proteins}
                                    g
                                </span>
                                <span className="flex-1 text-right">
                                    {expectedMacro.proteins}g
                                </span>
                            </div>
                            <div className="flex">
                                <span className="flex-1 text-left">Carbs:</span>
                                <span className="w-12 text-right font-bold">
                                    {expectedMacro.carbs - consumedMacro.carbs}g
                                </span>
                                <span className="flex-1 text-right">
                                    {expectedMacro.carbs}g
                                </span>
                            </div>
                            <div className="flex">
                                <span className="flex-1 text-left">Sugar:</span>
                                <span className="w-12 text-right font-bold">
                                    {expectedMacro.sugar}g
                                </span>
                                <span className="flex-1 text-right">
                                    {expectedMacro.sugar}g
                                </span>
                            </div>
                            <div className="flex">
                                <span className="flex-1 text-left">Fats:</span>
                                <span className="w-12 text-right font-bold">
                                    {expectedMacro.fats - consumedMacro.fats}g
                                </span>
                                <span className="flex-1 text-right">
                                    {expectedMacro.fats}g
                                </span>
                            </div>
                            <div className="flex">
                                <span className="flex-1 text-left">Fiber:</span>
                                <span className="w-12 text-right font-bold">
                                    {expectedMacro.fiber - consumedMacro.fiber}g
                                </span>
                                <span className="flex-1 text-right">
                                    {expectedMacro.fiber}g
                                </span>
                            </div>
                        </div>
                    </div>
                </TabPanel>
            </TabContext>
        </Box>
    )
}

export default DiagramConsumedRemaining
