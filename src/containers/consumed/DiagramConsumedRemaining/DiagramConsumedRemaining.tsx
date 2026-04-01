import useTranslation from 'next-translate/useTranslation'
import { useState } from 'react'
import DiagramCircular from '../../../components/DiagramCircular/DiagramCircular'
import useDaily from '@/hooks/useDaily'

interface DiagramConsumedRemainingProps {
    username: string
    startDate: string
    endDate: string
}

const MACROS = [
    { key: 'proteins', label: 'Protein', color: 'bg-macro-protein', textColor: 'text-macro-protein' },
    { key: 'carbs', label: 'Carbs', color: 'bg-macro-carbs', textColor: 'text-macro-carbs' },
    { key: 'sugar', label: 'Sugar', color: 'bg-[#7a7a7a]', textColor: 'text-[#7a7a7a]' },
    { key: 'fats', label: 'Fat', color: 'bg-macro-fat', textColor: 'text-macro-fat' },
    { key: 'fiber', label: 'Fiber', color: 'bg-[#7a7a7a]', textColor: 'text-[#7a7a7a]' },
] as const

const DiagramConsumedRemaining = (props: DiagramConsumedRemainingProps) => {
    const [mode, setMode] = useState<'consumed' | 'remaining'>('consumed')
    const { t } = useTranslation('nutrition-diary')
    const { consumedMacro, expectedMacro, burnedCaloriesSum } = useDaily(props)

    const isConsumed = mode === 'consumed'

    const netCal = consumedMacro.calories - burnedCaloriesSum
    const remainingCal = expectedMacro.calories - consumedMacro.calories + burnedCaloriesSum

    const ringText = `${isConsumed ? netCal : remainingCal}${t('Kcal')}`
    const ringValue = expectedMacro.calories > 0
        ? ((isConsumed ? netCal : remainingCal) / expectedMacro.calories) * 100
        : 0

    const getMacroValue = (key: string) => {
        const consumed = consumedMacro[key as keyof typeof consumedMacro] as number
        const expected = expectedMacro[key as keyof typeof expectedMacro] as number
        if (isConsumed) return consumed
        return expected - consumed
    }

    const getMacroExpected = (key: string) =>
        expectedMacro[key as keyof typeof expectedMacro] as number

    const getMacroPercent = (key: string) => {
        const expected = getMacroExpected(key)
        if (expected === 0) return 0
        const consumed = consumedMacro[key as keyof typeof consumedMacro] as number
        return Math.min((consumed / expected) * 100, 100)
    }

    return (
        <div className="glass p-4 lg:p-5">
            {/* Tab switch */}
            <div className="flex rounded-xl bg-[rgba(255,255,255,0.03)] p-[3px] mb-4">
                <button
                    className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all duration-300 ${
                        isConsumed
                            ? 'bg-[rgba(144,202,249,0.10)] text-primary-dark'
                            : 'text-[#7a7a7a]'
                    }`}
                    onClick={() => setMode('consumed')}
                >
                    {t('consumed')}
                </button>
                <button
                    className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all duration-300 ${
                        !isConsumed
                            ? 'bg-[rgba(144,202,249,0.10)] text-primary-dark'
                            : 'text-[#7a7a7a]'
                    }`}
                    onClick={() => setMode('remaining')}
                >
                    {t('remaining')}
                </button>
            </div>

            {/* Ring + macro bars */}
            <div className="flex gap-4 items-center">
                <DiagramCircular text={ringText} value={ringValue} />

                <div className="flex-1 flex flex-col gap-2">
                    {MACROS.map(({ key, label, color, textColor }) => (
                        <div key={key} className="flex items-center gap-2">
                            <span className={`text-[11px] font-semibold w-[46px] shrink-0 ${textColor}`}>
                                {label}
                            </span>
                            <div className="flex-1 h-[4px] rounded-full bg-[rgba(255,255,255,0.04)] overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${color}`}
                                    style={{ width: `${getMacroPercent(key)}%` }}
                                />
                            </div>
                            <span className="text-[11px] font-semibold text-[#9ca3af] w-[60px] text-right shrink-0">
                                {getMacroValue(key).toFixed(0)}
                                {isConsumed && ` / ${getMacroExpected(key)}g`}
                                {!isConsumed && 'g'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default DiagramConsumedRemaining
