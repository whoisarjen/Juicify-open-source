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
        <div className="grid w-full">
            <div className="mb-6 flex">
                <button
                    className={`flex-1 py-3 text-xs font-medium uppercase tracking-wide ${
                        value === '1'
                            ? 'border-b-2 border-[#90caf9] text-inherit'
                            : 'border-b border-gray-700 text-gray-400'
                    }`}
                    onClick={() => setValue('1')}
                >
                    {t('consumed')}
                </button>
                <button
                    className={`flex-1 py-3 text-xs font-medium uppercase tracking-wide ${
                        value === '2'
                            ? 'border-b-2 border-[#90caf9] text-inherit'
                            : 'border-b border-gray-700 text-gray-400'
                    }`}
                    onClick={() => setValue('2')}
                >
                    {t('remaining')}
                </button>
            </div>
            {value === '1' && (
                <div className="flex w-full p-0">
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
                </div>
            )}
            {value === '2' && (
                <div className="flex w-full p-0">
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
                </div>
            )}
        </div>
    )
}

export default DiagramConsumedRemaining
