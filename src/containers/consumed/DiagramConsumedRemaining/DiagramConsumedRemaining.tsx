import useTranslation from 'next-translate/useTranslation'
import { useState } from 'react'
import DiagramCircular from '../../../components/DiagramCircular/DiagramCircular'
import useDaily from '@/hooks/useDaily'
import { trpc } from '@/utils/trpc.utils'
import { useSession } from 'next-auth/react'
import { Zap } from 'lucide-react'

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

const fmtTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    return h > 0 ? `${h}h${m}m` : `${m}m`
}

const DiagramConsumedRemaining = (props: DiagramConsumedRemainingProps) => {
    const [mode, setMode] = useState<'consumed' | 'remaining'>('consumed')
    const { t } = useTranslation('nutrition-diary')
    const { consumedMacro, expectedMacro, burnedCaloriesSum } = useDaily(props)
    const { data: sessionData } = useSession()

    const isOwner = props.username === sessionData?.user?.username
    const { data: dayStats } = trpc.withings.dayStats.useQuery(
        { date: props.startDate },
        { enabled: isOwner && !!props.startDate }
    )

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

    const hasTdee = dayStats?.totalCalories != null
    const hasPills = dayStats && (dayStats.hrAverage != null || dayStats.steps != null || dayStats.totalSleepTime != null)

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

            {/* TDEE badge */}
            {hasTdee && (
                <div className="flex items-center justify-center gap-1 pt-3 pb-1 text-[10px] font-bold text-macro-kcal tracking-wide">
                    <Zap size={12} />
                    TDEE {dayStats.totalCalories!.toLocaleString()} kcal
                    <span className="text-[#7a7a7a] font-semibold">
                        ({(dayStats.totalCalories! - dayStats.activeCalories!).toLocaleString()} + {dayStats.activeCalories!.toLocaleString()} active)
                    </span>
                </div>
            )}

            {/* Health pills */}
            {hasPills && (
                <div className="flex gap-1.5 justify-center flex-wrap pt-1">
                    {dayStats.hrAverage != null && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-[#9ca3af] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-full px-2.5 py-1">
                            ❤️ <span className="text-primary-dark">{dayStats.hrAverage}</span> bpm
                        </span>
                    )}
                    {dayStats.steps != null && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-[#9ca3af] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-full px-2.5 py-1">
                            👟 <span className="text-primary-dark">{dayStats.steps.toLocaleString()}</span> steps
                        </span>
                    )}
                    {dayStats.totalSleepTime != null && dayStats.totalSleepTime > 0 && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-[#9ca3af] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-full px-2.5 py-1">
                            😴 <span className="text-primary-dark">{fmtTime(dayStats.totalSleepTime)}</span>
                            {dayStats.sleepScore != null && <span>· {dayStats.sleepScore}</span>}
                        </span>
                    )}
                </div>
            )}
        </div>
    )
}

export default DiagramConsumedRemaining
