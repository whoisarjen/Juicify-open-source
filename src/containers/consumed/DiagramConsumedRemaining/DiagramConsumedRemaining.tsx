import useTranslation from 'next-translate/useTranslation'
import { useState } from 'react'
import useDaily from '@/hooks/useDaily'
import { trpc } from '@/utils/trpc.utils'
import { useSession } from 'next-auth/react'
import { Zap } from 'lucide-react'

const RING_TRACKS = [
    { r: 44, sw: 4, color: '#34d399' },  // Calories
    { r: 37, sw: 4, color: '#d946ef' },  // Protein
    { r: 30, sw: 4, color: '#22d3ee' },  // Carbs
    { r: 23, sw: 4, color: '#fbbf24' },  // Fat
] as const

const clamp01 = (v: number) => Math.min(Math.max(v / 100, 0), 1)

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
    const { consumedMacro, expectedMacro, burnedCaloriesTotalSum } = useDaily(props)
    const { data: sessionData } = useSession()

    const isOwner = props.username === sessionData?.user?.username
    const { data: dayStats } = trpc.withings.dayStats.useQuery(
        { date: props.startDate },
        { enabled: isOwner && !!props.startDate }
    )

    const isConsumed = mode === 'consumed'

    // Net calories (after all burns)
    const netCal = consumedMacro.calories - burnedCaloriesTotalSum
    const netRemaining = expectedMacro.calories - consumedMacro.calories + burnedCaloriesTotalSum

    // Center text — net consumed or net remaining
    const centerValue = isConsumed ? netCal : netRemaining

    // Ring percentages (always consumed-based for visual fill)
    const pct = (v: number, t: number) => (t > 0 ? Math.min((v / t) * 100, 100) : 0)

    const ringPercents = [
        pct(consumedMacro.calories, expectedMacro.calories),
        pct(consumedMacro.proteins as number, expectedMacro.proteins as number),
        pct(consumedMacro.carbs as number, expectedMacro.carbs as number),
        pct(consumedMacro.fats as number, expectedMacro.fats as number),
    ]

    const calPercent = pct(consumedMacro.calories, expectedMacro.calories)

    // Macro helpers
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

            {/* Multi-ring + bars */}
            <div className="flex gap-4 items-center">
                {/* Concentric rings — Calories · Protein · Carbs · Fat */}
                <div className="h-[100px] w-[100px] shrink-0 lg:h-[120px] lg:w-[120px]">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        {RING_TRACKS.map(({ r, sw, color }, i) => {
                            const c = 2 * Math.PI * r
                            return (
                                <g key={i}>
                                    <circle cx="50" cy="50" r={r} fill="none"
                                        stroke="rgba(255,255,255,0.04)" strokeWidth={sw} />
                                    <circle cx="50" cy="50" r={r} fill="none"
                                        stroke={color} strokeWidth={sw} strokeLinecap="round"
                                        strokeDasharray={c}
                                        strokeDashoffset={c * (1 - clamp01(ringPercents[i]!))}
                                        transform="rotate(-90 50 50)"
                                        style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                                    />
                                </g>
                            )
                        })}
                        <text x="50" y="47" textAnchor="middle" dominantBaseline="central"
                            fill="#9ca3af" fontSize="8.5" fontWeight="700"
                            fontFamily="Quicksand, sans-serif">
                            {centerValue}
                        </text>
                        <text x="50" y="56" textAnchor="middle" dominantBaseline="central"
                            fill="#7a7a7a" fontSize="5" fontWeight="600"
                            fontFamily="Quicksand, sans-serif">
                            {t('Kcal')}
                        </text>
                    </svg>
                </div>

                {/* Macro bars + calorie bars */}
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
                            <span className="text-[11px] font-semibold text-[#9ca3af] w-[72px] text-right shrink-0">
                                {getMacroValue(key).toFixed(0)}
                                {isConsumed && ` / ${getMacroExpected(key)}g`}
                                {!isConsumed && 'g'}
                            </span>
                        </div>
                    ))}

                    <div className="h-px bg-[rgba(255,255,255,0.06)]" />

                    {/* Calories consumed + net */}
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold w-[46px] shrink-0 text-macro-kcal">
                            {t('Kcal')}
                        </span>
                        <div className="flex-1 h-[4px] rounded-full bg-[rgba(255,255,255,0.04)] overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-500 bg-macro-kcal"
                                style={{ width: `${calPercent}%` }}
                            />
                        </div>
                        <div className="flex items-baseline gap-1 shrink-0 text-right">
                            <span className="text-[11px] font-semibold text-[#9ca3af]">
                                {isConsumed
                                    ? `${consumedMacro.calories} / ${expectedMacro.calories}`
                                    : expectedMacro.calories - consumedMacro.calories}
                            </span>
                            {burnedCaloriesTotalSum > 0 && (
                                <span className="text-[9px] font-semibold text-burned">
                                    +{burnedCaloriesTotalSum}
                                </span>
                            )}
                        </div>
                    </div>
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
                            {dayStats.hrMin != null && dayStats.hrMax != null && (
                                <span className="text-[#7a7a7a]">({dayStats.hrMin}–{dayStats.hrMax})</span>
                            )}
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
