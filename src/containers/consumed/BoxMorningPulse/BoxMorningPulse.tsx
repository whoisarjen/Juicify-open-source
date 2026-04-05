import { useState, useCallback, useMemo } from 'react'
import { Sun, ChevronDown, Check } from 'lucide-react'
import { trpc } from '@/utils/trpc.utils'
import { useSession } from 'next-auth/react'
import { getLocalDayBounds } from '@/utils/global.utils'

const SIGNALS = [
    { id: 'pulseSleep', icon: '\uD83D\uDCA4', name: 'Sleep', color: '#818cf8' },
    { id: 'pulseFatigue', icon: '\u26A1', name: 'Fatigue', color: '#fbbf24' },
    { id: 'pulseMood', icon: '\uD83D\uDE0A', name: 'Mood', color: '#f472b6' },
    { id: 'pulseSoreness', icon: '\uD83E\uDDB4', name: 'Body soreness', color: '#fb923c' },
    { id: 'pulseStress', icon: '\uD83E\uDDD8', name: 'Stress', color: '#2dd4bf' },
    { id: 'pulseErection', icon: '\uD83C\uDF46', name: 'Morning erection', color: '#c084fc' },
] as const

type SignalId = (typeof SIGNALS)[number]['id']

const PULSE_KEYS = SIGNALS.map(s => s.id)

interface BoxMorningPulseProps {
    whenAdded: string
}

const BoxMorningPulse = ({ whenAdded }: BoxMorningPulseProps) => {
    const { data: sessionData } = useSession()
    const username = sessionData?.user?.username || ''
    const isMale = sessionData?.user?.sex === true

    const signals = isMale ? SIGNALS : SIGNALS.filter(s => s.id !== 'pulseErection')
    const total = signals.length

    const bounds = useMemo(() => getLocalDayBounds(whenAdded), [whenAdded])

    const { data: measurement } = trpc.measurement.getDay.useQuery(
        { username, whenAdded: bounds.startDate, whenAddedEnd: bounds.endDate },
        { enabled: !!username && !!whenAdded },
    )

    const pulseValues = useMemo(() => {
        if (!measurement) return {}
        const vals: Partial<Record<SignalId, number>> = {}
        for (const key of PULSE_KEYS) {
            const v = measurement[key as keyof typeof measurement]
            if (typeof v === 'number' && v >= 1 && v <= 5) {
                vals[key as SignalId] = v
            }
        }
        return vals
    }, [measurement])

    const answered = Object.keys(pulseValues).length
    const isDone = answered === total

    const [expanded, setExpanded] = useState(!isDone)

    const utils = trpc.useUtils()

    const createMeasurement = trpc.measurement.create.useMutation({
        onSuccess(data) {
            utils.measurement.getDay.setData(
                { username, whenAdded: bounds.startDate, whenAddedEnd: bounds.endDate },
                () => data,
            )
        },
    })

    const selectValue = useCallback((signalId: SignalId, value: number) => {
        const input = {
            whenAdded: new Date(whenAdded + 'T08:00:00'),
            [signalId]: value,
        }

        createMeasurement.mutate(input)

        // Optimistic: update cache immediately
        utils.measurement.getDay.setData(
            { username, whenAdded: bounds.startDate, whenAddedEnd: bounds.endDate },
            (current) => {
                if (!current) return current
                return { ...current, [signalId]: value }
            },
        )
    }, [whenAdded, username, bounds, createMeasurement, utils])

    return (
        <div className="glass overflow-hidden">
            {/* Header */}
            <div
                className="flex items-center justify-between px-4 py-3.5 cursor-pointer hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center gap-2">
                    <Sun size={14} className="text-[#fbbf24]" />
                    <span className="text-[12px] font-bold uppercase tracking-wide text-primary-dark">
                        Morning Pulse
                    </span>
                </div>
                <div className="flex items-center gap-1.5">
                    {isDone ? (
                        <span className="text-[10px] font-bold text-[#34d399] bg-[rgba(52,211,153,0.1)] px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Check size={10} />
                            Done
                        </span>
                    ) : (
                        <>
                            <div className="w-[60px] h-1 rounded-sm bg-[rgba(255,255,255,0.06)] overflow-hidden">
                                <div
                                    className="h-full rounded-sm transition-all duration-400"
                                    style={{
                                        width: `${(answered / total) * 100}%`,
                                        background: 'linear-gradient(90deg, #fbbf24, #fb923c)',
                                    }}
                                />
                            </div>
                            <span className="text-[10px] font-bold text-[#555]">
                                <span className="text-[#fbbf24]">{answered}</span>/{total}
                            </span>
                        </>
                    )}
                    <ChevronDown
                        size={14}
                        className={`text-[#555] transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
                    />
                </div>
            </div>

            {/* Summary bar when collapsed */}
            {!expanded && answered > 0 && (
                <div className="flex gap-1 px-4 pb-3">
                    {signals.map(sig => (
                        <div
                            key={sig.id}
                            className="flex-1 h-1 rounded-sm transition-all duration-300"
                            style={{
                                background: pulseValues[sig.id] !== undefined
                                    ? sig.color
                                    : 'rgba(255,255,255,0.04)',
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Body */}
            <div
                className="overflow-hidden transition-all duration-400"
                style={{
                    maxHeight: expanded ? `${signals.length * 52 + 20}px` : '0px',
                }}
            >
                <div className="h-px bg-[rgba(255,255,255,0.04)] mx-4" />
                <div className="pt-1.5">
                    {signals.map(sig => {
                        const currentVal = pulseValues[sig.id]
                        const isAnswered = currentVal !== undefined
                        return (
                            <div
                                key={sig.id}
                                className="flex items-center px-4 py-2.5 gap-2.5"
                            >
                                <span className="text-base flex-shrink-0 w-6 text-center">
                                    {sig.icon}
                                </span>
                                <span
                                    className="text-xs font-semibold flex-1 min-w-0 transition-colors duration-200"
                                    style={{ color: isAnswered ? sig.color : '#999' }}
                                >
                                    {sig.name}
                                </span>
                                <div className="flex gap-[5px] flex-shrink-0">
                                    {[1, 2, 3, 4, 5].map(v => {
                                        const selected = currentVal === v
                                        return (
                                            <button
                                                key={v}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    selectValue(sig.id, v)
                                                }}
                                                className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-200 border-[1.5px]"
                                                style={{
                                                    background: selected
                                                        ? sig.color
                                                        : 'rgba(255,255,255,0.03)',
                                                    borderColor: selected
                                                        ? sig.color
                                                        : 'rgba(255,255,255,0.06)',
                                                    color: selected ? '#121212' : '#555',
                                                    transform: selected ? 'scale(1.1)' : 'scale(1)',
                                                    boxShadow: selected
                                                        ? `0 0 12px ${sig.color}4D`
                                                        : 'none',
                                                }}
                                            >
                                                {v}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default BoxMorningPulse